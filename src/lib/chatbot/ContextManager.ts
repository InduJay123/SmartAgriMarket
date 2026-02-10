/**
 * Context Manager - Session-level Memory System
 * 
 * Academic Justification:
 * - Maintains conversation state across multiple turns
 * - Entity extraction and tracking (crops, dates, markets)
 * - Enables follow-up questions without repeating information
 * - Uses simple pattern matching and state management
 * 
 * Key Features:
 * - Remember last mentioned crop, market, timeframe
 * - Track conversation history
 * - Support contextual references ("what about next week?", "and for carrots?")
 */

export interface ConversationContext {
  sessionId: string;
  lastCrop?: string;
  lastMarket?: string;
  lastTimeframe?: string;
  lastPrediction?: any;
  conversationHistory: {
    userMessage: string;
    botResponse: string;
    intent: string;
    timestamp: Date;
  }[];
  entities: Map<string, string>; // Generic entity storage
}

export const AVAILABLE_CROPS = [
  // Primary vegetables from dataset
  'beans', 'bean',
  'brinjal', 'brinjals', 'eggplant', 'aubergine',
  'cabbage', 'cabbages',
  'carrot', 'carrots',
  'pumpkin', 'pumpkins',
  'snake gourd', 'snakegourd',
  'tomato', 'tomatoes',
  'big onion', 'onion', 'onions',
  'coconut', 'coconuts',
  'dried chilli', 'chilli', 'chillies', 'dried chillies',
  'green chilli', 'green chillies',
  'potato', 'potatoes',
  'red onion', 'red onions',
  'leeks', 'leek',
  // Common variations
  'pepper', 'peppers'
];

export const TIMEFRAMES = [
  'today', 'tomorrow', 'next week', 'next month', 
  'this week', 'this month', 'week', 'month'
];

export const MARKETS = [
  'colombo', 'pettah', 'dambulla', 'kandy', 'galle', 'jaffna'
];

export class ContextManager {
  private context: ConversationContext;
  private readonly MAX_HISTORY = 20;

  constructor(sessionId?: string) {
    this.context = {
      sessionId: sessionId || this.generateSessionId(),
      conversationHistory: [],
      entities: new Map()
    };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Normalize crop name to match backend format (e.g., "Tomato", "Big Onion")
   */
  private normalizeCropName(crop: string): string {
    // Map of lowercase crops to their proper backend names
    const cropMapping: Record<string, string> = {
      'beans': 'Beans', 'bean': 'Beans',
      'brinjal': 'Brinjal', 'brinjals': 'Brinjal', 'eggplant': 'Brinjal', 'aubergine': 'Brinjal',
      'cabbage': 'Cabbage', 'cabbages': 'Cabbage',
      'carrot': 'Carrot', 'carrots': 'Carrot',
      'pumpkin': 'Pumpkin', 'pumpkins': 'Pumpkin',
      'snake gourd': 'Snake gourd', 'snakegourd': 'Snake gourd',
      'tomato': 'Tomato', 'tomatoes': 'Tomato',
      'big onion': 'Big Onion', 'onion': 'Big Onion', 'onions': 'Big Onion',
      'coconut': 'Coconut', 'coconuts': 'Coconut',
      'dried chilli': 'Dried Chilli', 'chilli': 'Dried Chilli', 'chillies': 'Dried Chilli', 'dried chillies': 'Dried Chilli',
      'green chilli': 'Green Chilli', 'green chillies': 'Green Chilli',
      'potato': 'Potato', 'potatoes': 'Potato',
      'red onion': 'Red Onion', 'red onions': 'Red Onion',
      'leeks': 'Leeks', 'leek': 'Leeks',
      'pepper': 'Pepper', 'peppers': 'Pepper'
    };
    
    return cropMapping[crop.toLowerCase()] || crop.charAt(0).toUpperCase() + crop.slice(1);
  }

  /**
   * Extract crop name from message
   * Uses simple pattern matching - can be enhanced with NER
   */
  public extractCrop(message: string): string | null {
    const messageLower = message.toLowerCase();
    
    // Check for multi-word crops first (e.g., "big onion", "snake gourd")
    const multiWordCrops = ['big onion', 'snake gourd', 'dried chilli', 'green chilli', 'red onion'];
    for (const crop of multiWordCrops) {
      if (messageLower.includes(crop)) {
        return this.normalizeCropName(crop);
      }
    }
    
    // Direct crop mention
    for (const crop of AVAILABLE_CROPS) {
      if (messageLower.includes(crop)) {
        return this.normalizeCropName(crop);
      }
    }

    return null;
  }

  /**
   * Extract timeframe from message
   */
  public extractTimeframe(message: string): string | null {
    const messageLower = message.toLowerCase();
    
    for (const timeframe of TIMEFRAMES) {
      if (messageLower.includes(timeframe)) {
        return timeframe;
      }
    }

    // Check for specific dates
    const datePatterns = [
      /in (\d+) days?/,
      /in (\d+) weeks?/,
      /(\d{1,2})\/(\d{1,2})/,  // MM/DD or DD/MM
    ];

    for (const pattern of datePatterns) {
      const match = messageLower.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  /**
   * Extract market location from message
   */
  public extractMarket(message: string): string | null {
    const messageLower = message.toLowerCase();
    
    for (const market of MARKETS) {
      if (messageLower.includes(market)) {
        return market;
      }
    }

    return null;
  }

  /**
   * Update context with entities from current message
   */
  public updateContext(message: string, intent: string, botResponse: string): void {
    // Extract entities
    const crop = this.extractCrop(message);
    const timeframe = this.extractTimeframe(message);
    const market = this.extractMarket(message);

    // Update context only if new entities found
    if (crop) {
      this.context.lastCrop = crop;
      this.context.entities.set('crop', crop);
    }
    if (timeframe) {
      this.context.lastTimeframe = timeframe;
      this.context.entities.set('timeframe', timeframe);
    }
    if (market) {
      this.context.lastMarket = market;
      this.context.entities.set('market', market);
    }

    // Add to conversation history
    this.context.conversationHistory.push({
      userMessage: message,
      botResponse,
      intent,
      timestamp: new Date()
    });

    // Keep only recent history
    if (this.context.conversationHistory.length > this.MAX_HISTORY) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-this.MAX_HISTORY);
    }
  }

  /**
   * Resolve entities from context
   * Handles follow-up questions like "what about next week?" or "and for carrots?"
   */
  public resolveEntities(message: string): {
    crop?: string;
    timeframe?: string;
    market?: string;
    fromContext: boolean;
  } {
    const explicitCrop = this.extractCrop(message);
    const explicitTimeframe = this.extractTimeframe(message);
    const explicitMarket = this.extractMarket(message);

    // Check if message is a follow-up (contains words like "that", "it", "same", "also")
    const isFollowUp = /\b(that|it|same|also|and|too|what about|how about)\b/i.test(message);

    return {
      crop: explicitCrop || (isFollowUp ? this.context.lastCrop : undefined),
      timeframe: explicitTimeframe || (isFollowUp ? this.context.lastTimeframe : undefined),
      market: explicitMarket || (isFollowUp ? this.context.lastMarket : undefined),
      fromContext: isFollowUp && (!!this.context.lastCrop || !!this.context.lastTimeframe)
    };
  }

  /**
   * Get missing required entities
   */
  public getMissingEntities(requiredEntities: string[]): string[] {
    const missing: string[] = [];

    for (const entity of requiredEntities) {
      if (entity === 'crop' && !this.context.lastCrop) {
        missing.push('crop');
      } else if (entity === 'timeframe' && !this.context.lastTimeframe) {
        missing.push('timeframe');
      } else if (entity === 'market' && !this.context.lastMarket) {
        missing.push('market');
      }
    }

    return missing;
  }

  /**
   * Store prediction result for explanation purposes
   */
  public storePrediction(prediction: any): void {
    this.context.lastPrediction = prediction;
  }

  /**
   * Get last prediction (for explanations)
   */
  public getLastPrediction(): any {
    return this.context.lastPrediction;
  }

  /**
   * Get conversation history
   */
  public getHistory(): typeof this.context.conversationHistory {
    return this.context.conversationHistory;
  }

  /**
   * Get current context
   */
  public getContext(): ConversationContext {
    return this.context;
  }

  /**
   * Get last crop mentioned
   */
  public getLastCrop(): string | undefined {
    return this.context.lastCrop;
  }

  /**
   * Get last timeframe mentioned
   */
  public getLastTimeframe(): string | undefined {
    return this.context.lastTimeframe;
  }

  /**
   * Get last market mentioned
   */
  public getLastMarket(): string | undefined {
    return this.context.lastMarket;
  }

  /**
   * Check if this is likely a follow-up question
   */
  public isFollowUpQuestion(message: string): boolean {
    const followUpIndicators = [
      'what about',
      'how about',
      'and for',
      'also for',
      'what if',
      'same for',
      'and that',
      'and what',
      'next week',
      'next month',
      'tomorrow'
    ];

    const messageLower = message.toLowerCase();
    return followUpIndicators.some(indicator => messageLower.includes(indicator));
  }

  /**
   * Clear context (start fresh conversation)
   */
  public clearContext(): void {
    this.context = {
      sessionId: this.generateSessionId(),
      conversationHistory: [],
      entities: new Map()
    };
  }

  /**
   * Export context for persistence
   */
  public exportContext(): string {
    return JSON.stringify({
      ...this.context,
      entities: Array.from(this.context.entities.entries())
    });
  }

  /**
   * Import context from storage
   */
  public importContext(contextData: string): void {
    try {
      const parsed = JSON.parse(contextData);
      this.context = {
        ...parsed,
        entities: new Map(parsed.entities)
      };
    } catch (error) {
      console.error('Failed to import context:', error);
    }
  }
}
