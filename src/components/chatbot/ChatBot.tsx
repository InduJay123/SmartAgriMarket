import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Bot, User, Minimize2, GripHorizontal, BarChart3, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MLDashboard from './MLDashboard';
import { predictPrice, predictDemand, predictYield } from '../../lib/MLService';
import { ConversationManager } from '../../lib/chatbot/ConversationManager';
import { ContextManager } from '../../lib/chatbot/ContextManager';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'chart' | 'insight' | 'prediction';
  data?: any;
  confidence?: number; // AI confidence score (0-1)
  intents?: string[]; // Detected intents
  suggestedResponses?: string[]; // Quick reply suggestions
}

interface Position {
  x: number;
  y: number;
}

// Local storage keys
const CHAT_HISTORY_KEY = 'smartagri_chat_history';
const MAX_STORED_MESSAGES = 50;

// Save chat history to local storage
const saveChatHistory = (messages: Message[]) => {
  try {
    const toStore = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export default function ChatBot() {
  const { t, i18n } = useTranslation();
  const isSinhala = i18n.language === 'si';
  const welcomeMessage = t('chatbot.welcome');
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Initialize AI systems
  const [contextManager] = useState(() => new ContextManager());
  
  const [conversationManager] = useState(() => new ConversationManager(contextManager));
  
  // Load chat history on mount (disabled for testing - always start fresh)
  const [messages, setMessages] = useState<Message[]>(() => {
    // Always start with fresh welcome message
    return [{
      id: '1',
      text: welcomeMessage,
      sender: 'bot',
      timestamp: new Date(),
      confidence: 1.0
    }];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to local storage whenever they change (but not context to keep responses fresh)
  useEffect(() => {
    // Don't save during initial mount
    if (messages.length > 1) {
      saveChatHistory(messages);
    }
  }, [messages]);

  useEffect(() => {
    setMessages((previousMessages) => {
      if (
        previousMessages.length === 1 &&
        previousMessages[0]?.id === '1' &&
        previousMessages[0]?.sender === 'bot' &&
        previousMessages[0]?.text !== welcomeMessage
      ) {
        return [{ ...previousMessages[0], text: welcomeMessage }];
      }

      return previousMessages;
    });
  }, [welcomeMessage]);

  useEffect(() => {
    conversationManager.setLanguage(i18n.language);
  }, [conversationManager, i18n.language]);

  // Dragging state
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Initialize position to bottom-right corner
  useEffect(() => {
    const updateInitialPosition = () => {
      setPosition({
        x: window.innerWidth - 400, // 380px width + some margin
        y: window.innerHeight - 550, // approximate height + margin
      });
    };
    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = chatRef.current?.getBoundingClientRect() || buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Get element dimensions
    const element = chatRef.current || buttonRef.current;
    const elementWidth = element?.offsetWidth || 380;
    const elementHeight = element?.offsetHeight || 500;
    
    // Constrain to viewport
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - elementWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - elementHeight));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = chatRef.current?.getBoundingClientRect() || buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    const element = chatRef.current || buttonRef.current;
    const elementWidth = element?.offsetWidth || 380;
    const elementHeight = element?.offsetHeight || 500;
    
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - elementWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - elementHeight));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle price prediction API call
  const handlePricePrediction = async (crop: string, timeframe?: string, market?: string): Promise<any> => {
    const response = await predictPrice({
      crop_type: crop,
      season: 'northeast_monsoon',
      supply: 1000,
      demand: 1200,
      market_trend: 'stable',
    });
    
    // Store prediction in context for explanations
    contextManager.storePrediction({
      ...response,
      crop,
      timeframe,
      market,
      timestamp: new Date()
    });
    
    return response;
  };

  // Handle demand prediction API call
  const handleDemandPrediction = async (crop: string): Promise<any> => {
    const response = await predictDemand({
      crop_type: crop,
      season: 'northeast_monsoon',
      historical_demand: 1000,
      population: 22000000,
      consumption_trend: 'stable',
    });
    
    // Store prediction in context for explanations
    contextManager.storePrediction({
      ...response,
      crop,
      timestamp: new Date()
    });
    
    return response;
  };

  // Handle yield prediction API call
  const handleYieldPrediction = async (crop: string): Promise<any> => {
    const response = await predictYield({
      crop_type: crop,
      rainfall: 150,
      temperature: 28,
      soil_quality: 'good',
      fertilizer: 50,
      irrigation: true,
    });
    
    // Store prediction in context for explanations
    contextManager.storePrediction({
      ...response,
      crop,
      timestamp: new Date()
    });
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Process message with AI conversation manager
      const response = await conversationManager.processMessage(currentInput);
      
      // Check if action is required
      if (response.requiresAction) {
        if (response.actionType === 'show_dashboard') {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'bot',
            timestamp: new Date(),
            confidence: response.confidence
          };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          setIsDashboardOpen(true);
          return;
        }
        
        if (response.actionType === 'predict_price') {
          const { crop, timeframe, market } = response.actionData;
          
          // Show processing message
          const processingMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'bot',
            timestamp: new Date(),
            confidence: response.confidence
          };
          setMessages(prev => [...prev, processingMsg]);
          
          try {
            // Call prediction API
            const prediction = await handlePricePrediction(crop, timeframe, market);
            
            // Use actual model confidence from response (validation R²)
            const modelConfidence = prediction.model_accuracy?.r2_score || 0.8245;
            
            // Generate confidence-aware response
            const predictionText = conversationManager.formatPredictionWithConfidence(
              prediction,
              modelConfidence,
              crop,
              'price'
            );
            
            const predictionMsg: Message = {
              id: (Date.now() + 2).toString(),
              text: predictionText,
              sender: 'bot',
              timestamp: new Date(),
              type: 'prediction',
              confidence: modelConfidence,
              data: prediction
            };
            
            setMessages(prev => [...prev, predictionMsg]);
          } catch (err: any) {
            console.error('Price prediction failed:', err);
            const errorMsg: Message = {
              id: (Date.now() + 2).toString(),
              text: `❌ Sorry, I couldn't get the price prediction for ${crop} right now. The ML service may be unavailable.\n\nPlease make sure the backend server is running and try again.`,
              sender: 'bot',
              timestamp: new Date(),
              confidence: 0
            };
            setMessages(prev => [...prev, errorMsg]);
          }
          setIsTyping(false);
          return;
        }
        
        if (response.actionType === 'predict_demand') {
          const { crop } = response.actionData;
          
          // Show processing message
          const processingMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'bot',
            timestamp: new Date(),
            confidence: response.confidence
          };
          setMessages(prev => [...prev, processingMsg]);
          
          try {
            // Call demand prediction API
            const prediction = await handleDemandPrediction(crop);
            
            // Use actual model confidence from response (validation R²)
            const modelConfidence = prediction.model_accuracy?.r2_score || 0.7747;
            
            // Generate confidence-aware response
            const predictionText = conversationManager.formatPredictionWithConfidence(
              prediction,
              modelConfidence,
              crop,
              'demand'
            );
            
            const predictionMsg: Message = {
              id: (Date.now() + 2).toString(),
              text: predictionText,
              sender: 'bot',
              timestamp: new Date(),
              type: 'prediction',
              confidence: modelConfidence,
              data: prediction
            };
            
            setMessages(prev => [...prev, predictionMsg]);
          } catch (err: any) {
            console.error('Demand prediction failed:', err);
            const errorMsg: Message = {
              id: (Date.now() + 2).toString(),
              text: `❌ Sorry, I couldn't get the demand prediction for ${crop} right now. The ML service may be unavailable.\n\nPlease make sure the backend server is running and try again.`,
              sender: 'bot',
              timestamp: new Date(),
              confidence: 0
            };
            setMessages(prev => [...prev, errorMsg]);
          }
          setIsTyping(false);
          return;
        }
        
        if (response.actionType === 'predict_yield') {
          const { crop } = response.actionData;
          
          // Show processing message
          const processingMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'bot',
            timestamp: new Date(),
            confidence: response.confidence
          };
          setMessages(prev => [...prev, processingMsg]);
          
          try {
            // Call yield prediction API
            const prediction = await handleYieldPrediction(crop);
            
            // Use actual model confidence from response (validation R²)
            const modelConfidence = prediction.model_accuracy?.r2_score || 0.88;
            
            // Generate confidence-aware response
            const predictionText = conversationManager.formatPredictionWithConfidence(
              prediction,
              modelConfidence,
              crop,
              'yield'
            );
            
            const predictionMsg: Message = {
              id: (Date.now() + 2).toString(),
              text: predictionText,
              sender: 'bot',
              timestamp: new Date(),
              type: 'prediction',
              confidence: modelConfidence,
              data: prediction
            };
            
            setMessages(prev => [...prev, predictionMsg]);
          } catch (err: any) {
            console.error('Yield prediction failed:', err);
            const errorMsg: Message = {
              id: (Date.now() + 2).toString(),
              text: `❌ Sorry, I couldn't get the yield prediction for ${crop} right now. The ML service may be unavailable.\n\nPlease make sure the backend server is running and try again.`,
              sender: 'bot',
              timestamp: new Date(),
              confidence: 0
            };
            setMessages(prev => [...prev, errorMsg]);
          }
          setIsTyping(false);
          return;
        }
        
        if (response.actionType === 'explain') {
          const explanationText = generateExplanation(response.actionData);
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: explanationText,
            sender: 'bot',
            timestamp: new Date(),
            type: 'insight',
            confidence: response.confidence
          };
          
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          return;
        }
      }
      
      // Standard response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
          confidence: response.confidence,
          suggestedResponses: response.suggestedResponses
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 500 + Math.random() * 500);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chatbot.errorFallback'),
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0
      };
      
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  // Generate explanation for predictions
  const generateExplanation = (predictionData: any): string => {
    if (!predictionData) {
      return t('chatbot.noPredictionData');
    }

    const { crop, predicted_price, model_accuracy } = predictionData;
    const r2Score = model_accuracy?.r2_score || 0.78;
    const priceText = predicted_price?.toFixed(2) ?? '0.00';

    if (isSinhala) {
      return `🔍 **${crop} මිල අනාවැකිය සඳහා පැහැදිලි කිරීම**\n\n` +
        `රු. ${priceText} ලෙස ලැබුණු අනාවැකිය පහත කරුණු මත පදනම් වේ:\n\n` +
        `📊 **ප්‍රධාන සාධක:**\n` +
        `1. **සෘතුමය රටා** (40% බලපෑම)\n` +
        `   • වත්මන් කාලය සැපයුමට බලපායි\n` +
        `   • මෙම කාල පරාසයේ ඉතිහාසගත මිල ප්‍රවණතා\n\n` +
        `2. **සැපයුම සහ ඉල්ලුම** (35% බලපෑම)\n` +
        `   • වත්මන් වෙළඳපොළ සැපයුම් මට්ටම්\n` +
        `   • පාරිභෝගික ඉල්ලුම් රටා\n` +
        `   • ප්‍රාදේශීය වෙනස්කම්\n\n` +
        `3. **මෑත ප්‍රවණතා** (15% බලපෑම)\n` +
        `   • පසුගිය දින 7 හි මිල වෙනස්වීම්\n` +
        `   • පසුගිය දින 30 ක ගැලපෙන සාමාන්‍යය\n` +
        `   • මිල ගමන් වේග දර්ශක\n\n` +
        `4. **වෙළඳපොළ තත්ත්වයන්** (10% බලපෑම)\n` +
        `   • කාලගුණ රටා\n` +
        `   • ප්‍රවාහන පිරිවැය\n` +
        `   • වෙළඳපොළ ස්ථානීය සාධක\n\n` +
        `💡 **මොඩල විස්තර:**\n` +
        `• ඇල්ගොරිතමය: Random Forest (ගස් 15)\n` +
        `• විශේෂාංග: ඉංජිනේරුකරණය කළ 30+ විශේෂාංග\n` +
        `• පුහුණු දත්ත: වසර 9 ක වෙළඳපොළ දත්ත\n` +
        `• වලංගුකරණ නිරවද්‍යතාව: R² = ${(r2Score * 100).toFixed(2)}%\n\n` +
        `වෙනත් අනාවැකියක් උත්සාහ කරන්නද?`;
    }

    return `🔍 **Explanation for ${crop} price prediction**\n\n` +
      `The predicted price of Rs. ${priceText} is based on:\n\n` +
      `📊 **Key Factors:**\n` +
      `1. **Seasonal Patterns** (40% influence)\n` +
      `   • Current season affects supply availability\n` +
      `   • Historical price trends for this period\n\n` +
      `2. **Supply & Demand** (35% influence)\n` +
      `   • Current market supply levels\n` +
      `   • Consumer demand patterns\n` +
      `   • Regional variations\n\n` +
      `3. **Recent Trends** (15% influence)\n` +
      `   • Last 7-day price movements\n` +
      `   • Last 30-day rolling average\n` +
      `   • Price momentum indicators\n\n` +
      `4. **Market Conditions** (10% influence)\n` +
      `   • Weather patterns\n` +
      `   • Transportation costs\n` +
      `   • Market location factors\n\n` +
      `💡 **Model Details:**\n` +
      `• Algorithm: Random Forest (15 trees)\n` +
      `• Features: 30+ engineered features\n` +
      `• Training data: 9 years of market data\n` +
      `• Validation Accuracy: R² = ${(r2Score * 100).toFixed(2)}%\n\n` +
      `Want to try a different prediction?`;
  };

  // Clear chat history (commented out - can be used for reset button)
  // const clearChatHistory = () => {
  //   const initialMessage: Message = {
  //     id: Date.now().toString(),
  //     text: "Chat history cleared! 🧹 How can I help you today?",
  //     sender: 'bot',
  //     timestamp: new Date(),
  //   };
  //   setMessages([initialMessage]);
  //   localStorage.removeItem(CHAT_HISTORY_KEY);
  // };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: t('chatbot.quickActionPrice'), query: 'Predict price' },
    { label: t('chatbot.quickActionDemand'), query: 'Predict demand' },
    { label: t('chatbot.quickActionYield'), query: 'Predict yield' },
    { label: t('chatbot.quickActionAccuracy'), query: 'What is model accuracy?' },
    { label: t('chatbot.quickActionHelp'), query: 'Help me' },
  ];

  return (
    <>
      {/* ML Dashboard Modal */}
      <MLDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />

      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            ref={buttonRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => !isDragging && setIsOpen(true)}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
              left: position.x,
              top: position.y,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className="fixed z-50 bg-custom-green hover:bg-green-700 text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors select-none"
            aria-label={t('chatbot.openChat')}
          >
            <MessageCircle size={24} />
            <span className="hidden sm:inline font-medium">{t('chatbot.toggleText')}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              left: position.x,
              top: position.y,
            }}
            className="fixed z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col select-none"
          >
            {/* Header - Draggable Area */}
            <div 
              className="bg-custom-green text-white p-4 flex items-center justify-between"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('chatbot.headerTitle')}</h3>
                  <p className="text-xs text-green-100">{t('chatbot.headerSubtitle')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={t('chatbot.openDashboard')}
                  title={t('chatbot.openDashboard')}
                >
                  <BarChart3 size={18} />
                </button>
                <div className="p-2 text-white/60">
                  <GripHorizontal size={18} />
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMinimized ? t('chatbot.expandChat') : t('chatbot.minimizeChat')}
                  title={isMinimized ? t('chatbot.expandChat') : t('chatbot.minimizeChat')}
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={t('chatbot.closeChat')}
                  title={t('chatbot.closeChat')}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Content (hidden when minimized) */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ maxHeight: '300px' }}>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col gap-1 ${
                          message.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className={`flex items-start gap-2 ${
                          message.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}>
                          <div
                            className={`p-2 rounded-full flex-shrink-0 ${
                              message.sender === 'user'
                                ? 'bg-custom-green text-white'
                                : 'bg-green-100 text-custom-green'
                            }`}
                          >
                            {message.sender === 'user' ? (
                              <User size={16} />
                            ) : (
                              <Bot size={16} />
                            )}
                          </div>
                          <div className="flex flex-col gap-1 max-w-[75%]">
                            <div
                              className={`p-3 rounded-2xl whitespace-pre-line ${
                                message.sender === 'user'
                                  ? 'bg-custom-green text-white rounded-tr-md'
                                  : message.type === 'prediction'
                                  ? 'bg-gradient-to-br from-blue-50 to-green-50 text-gray-800 rounded-tl-md shadow-sm border-2 border-blue-200'
                                  : message.type === 'insight'
                                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 rounded-tl-md shadow-sm border-2 border-purple-200'
                                  : 'bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-100'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.text}</p>
                              
                              {/* Confidence Score (for bot messages) */}
                              {message.sender === 'bot' && message.confidence !== undefined && (
                                <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-xs">
                                  <Target size={12} className={
                                    message.confidence >= 0.8 ? 'text-green-600' :
                                    message.confidence >= 0.5 ? 'text-yellow-600' : 'text-gray-500'
                                  } />
                                  <span className={
                                    message.confidence >= 0.8 ? 'text-green-700 font-medium' :
                                    message.confidence >= 0.5 ? 'text-yellow-700' : 'text-gray-600'
                                  }>
                                      {t('chatbot.confidenceLabel')}: {(message.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              )}
                              
                              <p
                                className={`text-[10px] mt-1 ${
                                  message.sender === 'user'
                                    ? 'text-green-100'
                                    : 'text-gray-400'
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            
                            {/* Suggested Responses */}
                            {message.sender === 'bot' && message.suggestedResponses && message.suggestedResponses.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {message.suggestedResponses.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setInputValue(suggestion);
                                      setTimeout(() => handleSendMessage(), 100);
                                    }}
                                    className="px-2 py-1 bg-green-100 hover:bg-green-200 text-custom-green text-xs rounded-full transition-colors border border-green-300"
                                  >
                                    {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="bg-green-100 text-custom-green p-2 rounded-full">
                          <Bot size={16} />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  <div className="px-4 py-2 bg-white border-t border-gray-100">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {quickActions.map((action) => (
                        <button
                          key={action.query}
                          onClick={() => {
                            setInputValue(action.query);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="flex-shrink-0 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-custom-green text-xs rounded-full transition-colors border border-green-200"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('chatbot.inputPlaceholder')}
                        className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-custom-green focus:bg-white transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="p-2.5 bg-custom-green hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                        aria-label={t('chatbot.sendMessage')}
                        title={t('chatbot.sendMessage')}
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
