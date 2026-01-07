/**
 * Conversation Manager - Multi-turn Dialog Controller
 * 
 * Academic Justification:
 * - Orchestrates conversation flow with clarification questions
 * - Confidence-aware response generation
 * - Handles uncertainty gracefully with appropriate fallbacks
 * - State machine approach for dialog management
 * 
 * Key Features:
 * - Ask clarification when required data is missing
 * - Adjust response tone based on ML confidence
 * - Support complex multi-turn conversations
 */

import { IntentEngine, type IntentMatch } from './IntentEngine';
import { ContextManager, AVAILABLE_CROPS, MARKETS } from './ContextManager';

export interface ConversationState {
  waitingFor?: 'crop' | 'timeframe' | 'market' | 'confirmation';
  pendingIntent?: string;
  clarificationAttempts: number;
}

export interface BotResponse {
  text: string;
  confidence: number;
  requiresAction?: boolean;
  actionType?: 'predict_price' | 'predict_yield' | 'predict_demand' | 'explain' | 'show_dashboard';
  actionData?: any;
  suggestedResponses?: string[];
}

export class ConversationManager {
  private intentEngine: IntentEngine;
  private contextManager: ContextManager;
  private state: ConversationState;

  constructor(contextManager: ContextManager) {
    this.intentEngine = new IntentEngine();
    this.contextManager = contextManager;
    this.state = {
      clarificationAttempts: 0
    };
  }

  /**
   * Process user message and generate appropriate response
   */
  public async processMessage(message: string): Promise<BotResponse> {
    // Detect intents with confidence scores
    const intentMatches = this.intentEngine.detectIntents(message, 0.1);

    // If no intents detected
    if (intentMatches.length === 0) {
      return this.handleUnknownIntent(message);
    }

    // Get best intent
    const bestMatch = intentMatches[0];

    // Handle based on confidence level
    if (bestMatch.confidence >= 0.7) {
      return await this.handleHighConfidenceIntent(bestMatch, message);
    } else if (bestMatch.confidence >= 0.4) {
      return await this.handleMediumConfidenceIntent(bestMatch, intentMatches, message);
    } else {
      return await this.handleLowConfidenceIntent(bestMatch, intentMatches, message);
    }
  }

  /**
   * Handle high confidence intent (>= 0.7)
   */
  private async handleHighConfidenceIntent(
    match: IntentMatch,
    message: string
  ): Promise<BotResponse> {
    const intent = match.intent;

    // Update context
    this.contextManager.updateContext(message, intent.name, '');

    // Check if this is a prediction intent
    if (intent.apiAction === 'predict_price' || 
        intent.apiAction === 'predict_yield' || 
        intent.apiAction === 'predict_demand') {
      
      return await this.handlePredictionIntent(intent, message);
    }

    // Check if this is an explanation request
    if (intent.apiAction === 'explain') {
      return this.handleExplanationIntent(message);
    }

    // Check if dashboard request
    if (intent.apiAction === 'show_dashboard') {
      return {
        text: intent.response,
        confidence: match.confidence,
        requiresAction: true,
        actionType: 'show_dashboard'
      };
    }

    // Standard response
    return {
      text: intent.response,
      confidence: match.confidence
    };
  }

  /**
   * Handle medium confidence intent (0.4 - 0.7)
   */
  private async handleMediumConfidenceIntent(
    match: IntentMatch,
    allMatches: IntentMatch[],
    message: string
  ): Promise<BotResponse> {
    // Check if there are multiple possible intents
    const topMatches = allMatches.filter(m => m.confidence >= 0.3).slice(0, 3);

    if (topMatches.length > 1) {
      // Multiple intents detected - ask for clarification
      const intentNames = topMatches.map(m => this.getIntentDisplayName(m.intent.name));
      
      return {
        text: `I'm not entirely sure what you're asking about. Did you want to:\n${
          intentNames.map((name, i) => `${i + 1}. ${name}`).join('\n')
        }\n\nPlease clarify!`,
        confidence: match.confidence,
        suggestedResponses: topMatches.map(m => m.intent.response.split('\n')[0])
      };
    }

    // Single intent but medium confidence - proceed with caution
    const response = await this.handleHighConfidenceIntent(match, message);
    
    // Add uncertainty disclaimer
    return {
      ...response,
      text: `${response.text}\n\n💡 (If this isn't what you meant, try rephrasing your question)`
    };
  }

  /**
   * Handle low confidence intent (< 0.4)
   */
  private async handleLowConfidenceIntent(
    match: IntentMatch,
    _allMatches: IntentMatch[],
    _message: string
  ): Promise<BotResponse> {
    return {
      text: `I'm not quite sure what you're asking. Here are some things I can help with:\n\n` +
        `• **Price Predictions**: "What will tomato price be next week?"\n` +
        `• **Yield Forecasting**: "What yield for carrots?"\n` +
        `• **Demand Analysis**: "What's the demand for potatoes?"\n` +
        `• **Explanations**: "Why is the price increasing?"\n` +
        `• **Market Info**: "Show me market trends"\n\n` +
        `Try asking in a different way! 😊`,
      confidence: match.confidence
    };
  }

  /**
   * Handle unknown intent (no match)
   */
  private handleUnknownIntent(message: string): BotResponse {
    // Check if it's a simple yes/no or confirmation
    if (/^(yes|yeah|yep|sure|ok|okay|no|nope)\s*$/i.test(message.trim())) {
      return {
        text: "Got it! What would you like to know?",
        confidence: 0.5
      };
    }

    return {
      text: `I didn't quite understand that. 🤔\n\n` +
        `I can help with:\n` +
        `📊 Price predictions\n` +
        `🌾 Yield forecasting\n` +
        `📈 Demand analysis\n` +
        `💡 Market insights\n\n` +
        `Type "help" to see examples!`,
      confidence: 0
    };
  }

  /**
   * Handle prediction intents (price, yield, demand)
   */
  private async handlePredictionIntent(
    intent: any,
    message: string
  ): Promise<BotResponse> {
    // Resolve entities (crop, timeframe, market) from message and context
    const entities = this.contextManager.resolveEntities(message);

    // Check for missing required entities
    const missingEntities: string[] = [];
    
    if (!entities.crop) {
      missingEntities.push('crop');
    }

    // If entities are missing, ask clarification
    if (missingEntities.length > 0) {
      this.state.waitingFor = missingEntities[0] as any;
      this.state.pendingIntent = intent.apiAction;
      this.state.clarificationAttempts++;

      return this.askForMissingEntity(missingEntities[0]);
    }

    // All entities present - prepare API call
    const predictionType = intent.apiAction.replace('predict_', '');
    
    return {
      text: `🤖 Analyzing ${predictionType} prediction for ${entities.crop}...\n\n` +
        `${entities.fromContext ? '(Using context from previous conversation)' : ''}`,
      confidence: 0.95,
      requiresAction: true,
      actionType: intent.apiAction,
      actionData: {
        crop: entities.crop,
        timeframe: entities.timeframe || 'next week',
        market: entities.market || 'colombo'
      }
    };
  }

  /**
   * Ask for missing entity
   */
  private askForMissingEntity(entityType: string): BotResponse {
    const responses = {
      crop: {
        text: `Which crop are you interested in? 🌾\n\nAvailable: ${
          AVAILABLE_CROPS.filter((_, i) => i % 2 === 0).slice(0, 6).join(', ')
        }, etc.`,
        suggestedResponses: ['Tomato', 'Carrot', 'Potato', 'Onion']
      },
      timeframe: {
        text: `For which time period? 📅\n\nExamples: tomorrow, next week, next month`,
        suggestedResponses: ['Next week', 'Tomorrow', 'Next month']
      },
      market: {
        text: `Which market location? 📍\n\nAvailable: ${MARKETS.slice(0, 4).join(', ')}`,
        suggestedResponses: MARKETS.slice(0, 4).map(m => m.charAt(0).toUpperCase() + m.slice(1))
      }
    };

    return {
      ...responses[entityType as keyof typeof responses],
      confidence: 0.8
    };
  }

  /**
   * Handle explanation requests
   */
  private handleExplanationIntent(_message: string): BotResponse {
    const lastPrediction = this.contextManager.getLastPrediction();
    
    if (!lastPrediction) {
      return {
        text: "I don't have a recent prediction to explain. Please make a prediction first, then ask why!",
        confidence: 0.9
      };
    }

    // Request explanation from backend
    return {
      text: `Let me explain the factors behind this prediction...`,
      confidence: 0.9,
      requiresAction: true,
      actionType: 'explain',
      actionData: lastPrediction
    };
  }

  /**
   * Generate confidence-aware response text
   * Adjusts language based on ML model confidence
   */
  public formatPredictionWithConfidence(
    prediction: any,
    modelConfidence: number,
    crop: string
  ): string {
    let confidenceText = '';
    let emoji = '';

    if (modelConfidence >= 0.95) {
      confidenceText = 'High confidence';
      emoji = '🎯';
    } else if (modelConfidence >= 0.85) {
      confidenceText = 'Good confidence';
      emoji = '✅';
    } else if (modelConfidence >= 0.70) {
      confidenceText = 'Moderate confidence';
      emoji = '⚠️';
    } else {
      confidenceText = 'Lower confidence - treat as estimate';
      emoji = '📊';
    }

    const uncertaintyNote = modelConfidence < 0.85 
      ? `\n\n⚠️ **Note**: This prediction has ${confidenceText.toLowerCase()}. Market conditions can vary.`
      : '';

    return `${emoji} **AI Prediction for ${crop.charAt(0).toUpperCase() + crop.slice(1)}**\n\n` +
      `💰 Predicted Price: **Rs. ${prediction.predicted_price?.toFixed(2) || 'N/A'}** per kg\n` +
      `📊 Confidence: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
      `Key Factors:\n` +
      `• Seasonal patterns\n` +
      `• Current supply-demand balance\n` +
      `• Recent price trends\n` +
      `${uncertaintyNote}\n\n` +
      `💡 Want to know why? Ask "Why is this the price?" or "Explain this prediction"`;
  }

  /**
   * Get display name for intent
   */
  private getIntentDisplayName(intentName: string): string {
    const displayNames: Record<string, string> = {
      predict_price: 'Get price prediction',
      predict_yield: 'Get yield forecast',
      predict_demand: 'Get demand analysis',
      explain_prediction: 'Explain a prediction',
      browse_products: 'Browse products',
      market_trends: 'View market trends',
      help: 'Get help',
      model_accuracy: 'View model accuracy'
    };

    return displayNames[intentName] || intentName;
  }

  /**
   * Get context manager instance
   */
  public getContextManager(): ContextManager {
    return this.contextManager;
  }

  /**
   * Get intent engine instance
   */
  public getIntentEngine(): IntentEngine {
    return this.intentEngine;
  }

  /**
   * Reset conversation state
   */
  public resetState(): void {
    this.state = {
      clarificationAttempts: 0
    };
  }
}
