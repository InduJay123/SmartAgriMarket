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
import { ContextManager, MARKETS } from './ContextManager';

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
  predictionType?: 'price' | 'yield' | 'demand';
}

type SupportedLanguage = 'en' | 'si';

export class ConversationManager {
  private intentEngine: IntentEngine;
  private contextManager: ContextManager;
  private state: ConversationState;
  private language: SupportedLanguage;

  constructor(contextManager: ContextManager, language: string = 'en') {
    this.intentEngine = new IntentEngine();
    this.contextManager = contextManager;
    this.language = language.startsWith('si') ? 'si' : 'en';
    this.state = {
      clarificationAttempts: 0
    };
  }

  public setLanguage(language: string): void {
    this.language = language.startsWith('si') ? 'si' : 'en';
  }

  private isSinhala(): boolean {
    return this.language === 'si';
  }

  private getLocalizedIntentResponse(intentName: string, fallbackText: string): string {
    const siResponses: Record<string, string> = {
      predict_price: 'මට ඔබට බෝග මිල අනාවැකි දෙන්න පුළුවන්. ඔබ කැමති බෝගය කුමක්ද?',
      predict_yield: 'මට බෝග අස්වැන්න අනාවැකිය ලබා දෙන්න පුළුවන්. බෝගය මොකද්ද?',
      predict_demand: 'මට වෙළඳපොළ ඉල්ලුම පුරෝකථනය කරන්න පුළුවන්. ඔබ අහන්නේ කුමන බෝගයක් ගැනද?',
      explain_prediction: 'මේ අනාවැකියට බලපාන කරුණු මම පැහැදිලි කරන්නම්.',
      greeting: 'ආයුබෝවන්! 👋 SmartAgriMarket වෙත සාදරයෙන් පිළිගනිමු. මම ඔබගේ AI කෘෂිකාර්මික සහායකයා.\n• මිල අනාවැකි 📊\n• අස්වැන්න පුරෝකථනය 🌾\n• ඉල්ලුම් විශ්ලේෂණය 📈\n• වෙළඳපොළ අවබෝධය 💡\n\nඔබට දැනගන්න ඕනෙ මොනවාද?',
      help: 'මම ඔබගේ AI ගොවි සහායකයා! 🤖 මට මෙවලම් තියෙනවා:\n\n📊 **මිල අනාවැකි**: "ලබන සතියේ තක්කාලි මිල කීයද?"\n🌾 **අස්වැන්න පුරෝකථනය**: "කැරට් අස්වැන්න කොච්චරද?"\n📈 **ඉල්ලුම් විශ්ලේෂණය**: "බෝංචි ඉල්ලුම කොච්චරද?"\n💡 **පැහැදිලි කිරීම**: "මිල වැඩි වෙන්නේ ඇයි?"\n\nසාමාන්‍ය විදිහට අහන්න - මම තේරුම් ගන්නම්!',
      browse_products: 'අප සතුව නැවුම් නිෂ්පාදන ඇත:\n• එළවළු: තක්කාලි, කැරට්, බෝංචි, ගෝවා, වම්බටු, වට්ටක්කා 🥕\n• අනෙකුත්: ලොකු ලූනු, පොල්, වියළි මිරිස් 🌶️\n\nඔබට වැඩියෙන් දැනගන්න ඕනේ මොනවාද?',
      market_trends: '📊 වත්මන් වෙළඳපොළ ප්‍රවණතා:\n• සෘතුමය රටා සැපයුමට බලපානවා\n• මිල වෙනස්වීම් දර්ශක\n• ඉල්ලුම්-සැපයුම් සමතුලිතතාව\n\nඔබට කුමන බෝගයේ ප්‍රවණතා බලන්න ඕනේ?',
      quality_info: '🏆 ගුණාත්මකතා ඇගයීම:\n• වර්ණය සහ වයනය\n• නැවුම්භාව පරීක්ෂා ක්‍රම\n• ශ්‍රේණිගත කිරීමේ ප්‍රමිතීන්\n• ජෛව සහතික\n\nඔබගේ බෝගයේ ගුණාත්මකතා කරුණු ඇගයීමට මට උදව් කරන්න පුළුවන්!',
      order_info: 'ඇණවුමක් දාන්න:\n1. Shop තුළ නිෂ්පාදන බලන්න\n2. Cart එකට එකතු කරන්න\n3. Checkout කරන්න\n4. බෙදාහැරීමේ විස්තර ඇතුළත් කරන්න\n\nනිශ්චිත ඇණවුමක් ගැන උදව් ඕනෙද?',
      farmer_registration: 'ගොවියෙකු ලෙස එක්වෙන්න:\n1. ලියාපදිංචි වන්න\n2. සත්‍යාපනය කරගන්න\n3. ඔබේ නිෂ්පාදන ලැයිස්තුගත කරන්න\n4. මිල සඳහා AI අවබෝධය භාවිතා කරන්න\n5. ආදායම ආරම්භ කරන්න! 💰\n\nලියාපදිංචි වෙන්න සූදානම්ද?',
      gratitude: 'ස්තූතියි! 😊 තව මොනවා හරි උදව් කරමුද?',
      farewell: 'ආයුබෝවන්! 👋 සාර්ථක ගොවිතැනක් වේවා! 🌾',
      model_accuracy: '🎯 AI මොඩල කාර්යසාධනය:\n\n**මිල මොඩලය:**\n• වසර 9ක දත්ත සමඟ Random Forest\n• වෙළඳපොළ ප්‍රවණතා + සෘතුමය රටා\n\n**ඉල්ලුම් මොඩලය:**\n• ඉතිහාසගත ඉල්ලුම් රටා\n• ටොන් වලින් ඉල්ලුම පුරෝකථනය\n\n**අස්වැන්න මොඩලය:**\n• වර්ෂාපතනය, උෂ්ණත්වය, මැටි\n• හෙක්ටයාර් එකකට අස්වැන්න\n\n📊 සජීවී දත්ත සඳහා Dashboard බලන්න!',
      show_dashboard: '📊 ML පුවරුව විවෘත කරමින්...'
    };

    return this.isSinhala() ? (siResponses[intentName] || fallbackText) : fallbackText;
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
        text: this.getLocalizedIntentResponse(intent.name, intent.response),
        confidence: match.confidence,
        requiresAction: true,
        actionType: 'show_dashboard'
      };
    }

    // Standard response
    return {
      text: this.getLocalizedIntentResponse(intent.name, intent.response),
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

      const text = this.isSinhala()
        ? `ඔබ අහන්නේ කුමක්දැයි මට ටිකක් පැහැදිලි නැහැ. ඔබට අවශ්‍යද:\n${
            intentNames.map((name, i) => `${i + 1}. ${name}`).join('\n')
          }\n\nකරුණාකර පැහැදිලි කරන්න!`
        : `I'm not entirely sure what you're asking about. Did you want to:\n${
            intentNames.map((name, i) => `${i + 1}. ${name}`).join('\n')
          }\n\nPlease clarify!`;

      return {
        text,
        confidence: match.confidence,
        suggestedResponses: topMatches.map((m) =>
          this.getLocalizedIntentResponse(m.intent.name, m.intent.response).split('\n')[0]
        )
      };
    }

    // Single intent but medium confidence - proceed with caution
    const response = await this.handleHighConfidenceIntent(match, message);
    
    // Add uncertainty disclaimer
    return {
      ...response,
      text: this.isSinhala()
        ? `${response.text}\n\n💡 (මෙය ඔබ අර්ථවත් කළ දේ නොවේ නම්, ප්‍රශ්නය වෙනත් ලෙස ලියන්න)`
        : `${response.text}\n\n💡 (If this isn't what you meant, try rephrasing your question)`
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
      text: this.isSinhala()
        ? `ඔබ අහපු දේ මට පැහැදිලිව තේරුණේ නැහැ. මට උදව් කළ හැකි දේවල්:\n\n` +
          `• **මිල අනාවැකි**: "ලබන සතියේ තක්කාලි මිල කීයද?"\n` +
          `• **අස්වැන්න පුරෝකථනය**: "කැරට් අස්වැන්න කොච්චරද?"\n` +
          `• **ඉල්ලුම් විශ්ලේෂණය**: "බෝංචි ඉල්ලුම කොච්චරද?"\n` +
          `• **පැහැදිලි කිරීම්**: "මිල වැඩි වෙන්නේ ඇයි?"\n` +
          `• **වෙළඳපොළ තොරතුරු**: "වෙළඳපොළ ප්‍රවණතා පෙන්වන්න"\n\n` +
          `වෙනත් ආකාරයකින් අහලා බලන්න! 😊`
        : `I'm not quite sure what you're asking. Here are some things I can help with:\n\n` +
          `• **Price Predictions**: "What will Tomato price be next week?"\n` +
          `• **Yield Forecasting**: "What yield for Carrot?"\n` +
          `• **Demand Analysis**: "What's the demand for Beans?"\n` +
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
    if (/^(yes|yeah|yep|sure|ok|okay|no|nope|ඔව්|හා|නැහැ|නෑ)\s*$/i.test(message.trim())) {
      return {
        text: this.isSinhala() ? 'හරි! ඔබට දැනගන්න ඕනේ මොකද්ද?' : 'Got it! What would you like to know?',
        confidence: 0.5
      };
    }

    return {
      text: this.isSinhala()
        ? `මට ඒක හරියට තේරුණේ නැහැ. 🤔\n\n` +
          `මට උදව් කළ හැක්කේ:\n` +
          `📊 මිල අනාවැකි\n` +
          `🌾 අස්වැන්න පුරෝකථනය\n` +
          `📈 ඉල්ලුම් විශ්ලේෂණය\n` +
          `💡 වෙළඳපොළ අවබෝධය\n\n` +
          `උදාහරණ බලන්න "help" ටයිප් කරන්න!`
        : `I didn't quite understand that. 🤔\n\n` +
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
    const predictionType = intent.apiAction.replace('predict_', '') as 'price' | 'yield' | 'demand';

    const progressText = this.isSinhala()
      ? `🤖 ${entities.crop} සඳහා ${predictionType} අනාවැකිය විශ්ලේෂණය කරමින්...\n\n` +
        `${entities.fromContext ? '(පෙර සංවාදයේ සන්දර්භය භාවිතා කරමින්)' : ''}`
      : `🤖 Analyzing ${predictionType} prediction for ${entities.crop}...\n\n` +
        `${entities.fromContext ? '(Using context from previous conversation)' : ''}`;

    return {
      text: progressText,
      confidence: 0.95,
      requiresAction: true,
      actionType: intent.apiAction,
      predictionType: predictionType,
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
        text: this.isSinhala()
          ? `ඔබ කැමති බෝගය කුමක්ද? 🌾\n\nලභ්‍ය: Tomato, Carrot, Beans, Cabbage, Pumpkin, Brinjal, Big Onion, ආදිය.`
          : `Which crop are you interested in? 🌾\n\nAvailable: Tomato, Carrot, Beans, Cabbage, Pumpkin, Brinjal, Big Onion, etc.`,
        suggestedResponses: ['Tomato', 'Carrot', 'Beans', 'Cabbage']
      },
      timeframe: {
        text: this.isSinhala()
          ? `කුමන කාල පරාසය සඳහාද? 📅\n\nඋදාහරණ: tomorrow, next week, next month`
          : `For which time period? 📅\n\nExamples: tomorrow, next week, next month`,
        suggestedResponses: ['Next week', 'Tomorrow', 'Next month']
      },
      market: {
        text: this.isSinhala()
          ? `කුමන වෙළඳපොළ ස්ථානයද? 📍\n\nලභ්‍ය: ${MARKETS.slice(0, 4).join(', ')}`
          : `Which market location? 📍\n\nAvailable: ${MARKETS.slice(0, 4).join(', ')}`,
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
        text: this.isSinhala()
          ? 'මෑත අනාවැකියක් පැහැදිලි කිරීමට ලැබී නැහැ. මුලින් අනාවැකියක් කරලා පසුව ඇයි කියලා අහන්න!'
          : "I don't have a recent prediction to explain. Please make a prediction first, then ask why!",
        confidence: 0.9
      };
    }

    // Request explanation from backend
    return {
      text: this.isSinhala()
        ? 'මෙම අනාවැකියට බලපාන සාධක මම පැහැදිලි කරන්නම්...'
        : 'Let me explain the factors behind this prediction...',
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
    crop: string,
    predictionType: 'price' | 'yield' | 'demand' = 'price'
  ): string {
    let confidenceText = '';
    let emoji = '';

    if (modelConfidence >= 0.95) {
      confidenceText = this.isSinhala() ? 'ඉහළ විශ්වාසය' : 'High confidence';
      emoji = '🎯';
    } else if (modelConfidence >= 0.85) {
      confidenceText = this.isSinhala() ? 'හොඳ විශ්වාසය' : 'Good confidence';
      emoji = '✅';
    } else if (modelConfidence >= 0.70) {
      confidenceText = this.isSinhala() ? 'මධ්‍යම විශ්වාසය' : 'Moderate confidence';
      emoji = '⚠️';
    } else {
      confidenceText = this.isSinhala() ? 'අඩු විශ්වාසය - ඇස්තමේන්තුවක් ලෙස සලකන්න' : 'Lower confidence - treat as estimate';
      emoji = '📊';
    }

    const uncertaintyNote = modelConfidence < 0.85 
      ? this.isSinhala()
        ? `\n\n⚠️ **සටහන**: මෙම අනාවැකියේ ${confidenceText.toLowerCase()} ඇත. වෙළඳපොළ තත්ත්ව වෙනස් විය හැක.`
        : `\n\n⚠️ **Note**: This prediction has ${confidenceText.toLowerCase()}. Market conditions can vary.`
      : '';

    const cropName = crop.charAt(0).toUpperCase() + crop.slice(1);

    // Format based on prediction type
    if (predictionType === 'demand') {
      if (this.isSinhala()) {
        return `${emoji} **${cropName} සඳහා AI ඉල්ලුම් අනාවැකිය**\n\n` +
          `📈 අනාවැකි ඉල්ලුම: **${prediction.predicted_demand?.toFixed(0) || 'N/A'} ${prediction.unit || 'metric tons'}**\n` +
          `📊 විශ්වාසය: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
          `ප්‍රධාන සාධක:\n` +
          `• පාරිභෝගික කැමැත්ත\n` +
          `• ජනගහන ප්‍රවණතා\n` +
          `• මිල සංවේදීතාව\n` +
          `• සෘතුමය සාධක\n` +
          `${uncertaintyNote}\n\n` +
          `💡 තවත් විස්තර ඕනෙද? "Explain this prediction" කියලා අහන්න`;
      }

      return `${emoji} **AI Demand Prediction for ${cropName}**\n\n` +
        `📈 Predicted Demand: **${prediction.predicted_demand?.toFixed(0) || 'N/A'} ${prediction.unit || 'metric tons'}**\n` +
        `📊 Confidence: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
        `Key Factors:\n` +
        `• Consumer preferences\n` +
        `• Population demographics\n` +
        `• Price sensitivity\n` +
        `• Seasonal factors\n` +
        `${uncertaintyNote}\n\n` +
        `💡 Want to know why? Ask "Why is demand this high?" or "Explain this prediction"`;
    } else if (predictionType === 'yield') {
      if (this.isSinhala()) {
        return `${emoji} **${cropName} සඳහා AI අස්වැන්න අනාවැකිය**\n\n` +
          `🌾 අනාවැකි අස්වැන්න: **${prediction.predicted_yield?.toFixed(0) || 'N/A'} ${prediction.unit || 'kg/hectare'}**\n` +
          `📊 විශ්වාසය: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
          `ප්‍රධාන සාධක:\n` +
          `• මැටි ගුණාත්මකභාවය\n` +
          `• කාලගුණ තත්ත්වයන්\n` +
          `• ගොවිතැන් පුරුදු\n` +
          `• බෝග වර්ගය\n` +
          `${uncertaintyNote}\n\n` +
          `💡 ඇයි මේ අස්වැන්න ලැබුණේ කියලා දැනගන්න "Explain this prediction" කියලා අහන්න`;
      }

      return `${emoji} **AI Yield Prediction for ${cropName}**\n\n` +
        `🌾 Predicted Yield: **${prediction.predicted_yield?.toFixed(0) || 'N/A'} ${prediction.unit || 'kg/hectare'}**\n` +
        `📊 Confidence: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
        `Key Factors:\n` +
        `• Soil quality\n` +
        `• Weather conditions\n` +
        `• Farming practices\n` +
        `• Crop variety\n` +
        `${uncertaintyNote}\n\n` +
        `💡 Want to know why? Ask "Why this yield?" or "Explain this prediction"`;
    } else {
      // Price prediction
      if (this.isSinhala()) {
        return `${emoji} **${cropName} සඳහා AI මිල අනාවැකිය**\n\n` +
          `💰 අනාවැකි මිල: **රු. ${prediction.predicted_price?.toFixed(2) || 'N/A'}** කිලෝවකට\n` +
          `📊 විශ්වාසය: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
          `ප්‍රධාන සාධක:\n` +
          `• සෘතුමය රටා\n` +
          `• වත්මන් ඉල්ලුම්-සැපයුම් සමතුලිතතාව\n` +
          `• මෑත මිල ප්‍රවණතා\n` +
          `${uncertaintyNote}\n\n` +
          `💡 ඇයි මේ මිල ලැබුණේ කියලා දැනගන්න "Explain this prediction" කියලා අහන්න`;
      }

      return `${emoji} **AI Price Prediction for ${cropName}**\n\n` +
        `💰 Predicted Price: **Rs. ${prediction.predicted_price?.toFixed(2) || 'N/A'}** per kg\n` +
        `📊 Confidence: **${(modelConfidence * 100).toFixed(1)}%** (${confidenceText})\n\n` +
        `Key Factors:\n` +
        `• Seasonal patterns\n` +
        `• Current supply-demand balance\n` +
        `• Recent price trends\n` +
        `${uncertaintyNote}\n\n` +
        `💡 Want to know why? Ask "Why is this the price?" or "Explain this prediction"`;
    }
  }

  /**
   * Get display name for intent
   */
  private getIntentDisplayName(intentName: string): string {
    if (this.isSinhala()) {
      const sinhalaDisplayNames: Record<string, string> = {
        predict_price: 'මිල අනාවැකිය ලබාගන්න',
        predict_yield: 'අස්වැන්න පුරෝකථනය ලබාගන්න',
        predict_demand: 'ඉල්ලුම් විශ්ලේෂණය ලබාගන්න',
        explain_prediction: 'අනාවැකිය පැහැදිලි කරන්න',
        browse_products: 'නිෂ්පාදන බලන්න',
        market_trends: 'වෙළඳපොළ ප්‍රවණතා බලන්න',
        help: 'උදව් ලබාගන්න',
        model_accuracy: 'මොඩල නිරවද්‍යතාව බලන්න'
      };

      return sinhalaDisplayNames[intentName] || intentName;
    }

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
