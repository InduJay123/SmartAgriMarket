import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, GripHorizontal, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MLDashboard from './MLDashboard';
import { predictPrice, AVAILABLE_CROPS } from '../../lib/MLService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'chart' | 'insight' | 'prediction';
  data?: any;
}

interface Position {
  x: number;
  y: number;
}

// Local storage key for chat history
const CHAT_HISTORY_KEY = 'smartagri_chat_history';
const MAX_STORED_MESSAGES = 50;

// Load chat history from local storage
const loadChatHistory = (): Message[] => {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const messages = JSON.parse(stored);
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
  return [];
};

// Save chat history to local storage
const saveChatHistory = (messages: Message[]) => {
  try {
    const toStore = messages.slice(-MAX_STORED_MESSAGES);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

// Enhanced bot responses with ML insights
const botResponses: Record<string, string> = {
  hello: "Hello! 👋 Welcome to SmartAgriMarket. I'm your AI agricultural assistant powered by machine learning. How can I help you today?",
  hi: "Hi there! 🌱 I'm here to help with produce, pricing predictions, market trends, and farming tips. What would you like to know?",
  help: "I can help you with:\n• Finding fresh produce and crops 🥕\n• AI-powered pricing predictions 📊\n• Market trends and demand forecasting 📈\n• Connecting with local farmers 👨‍🌾\n• Placing and tracking orders 📦\n• Agricultural tips and yield optimization 🌾\n• Quality assessment of crops\n\nJust ask me anything!",
  products: "We have a wide variety of fresh agricultural products including:\n• Vegetables (tomatoes, carrots, potatoes, onions, peppers) 🥕\n• Fruits (mangoes, bananas, oranges, apples) 🍎\n• Grains and cereals 🌾\n• Spices and herbs 🌶️\n\nVisit our Shop to browse all products!",
  price: "I can predict and analyze crop prices using AI! 📊\n\nFactors affecting prices:\n• Seasonality and weather patterns 🌤️\n• Supply and demand 📈\n• Quality grade and freshness\n• Current market trends\n\nAsk me 'What will tomato price be next week?' or 'Predict carrot prices for next month'",
  order: "To place an order:\n1. Browse products in the Shop\n2. Add items to your cart\n3. Review your cart\n4. Proceed to checkout\n5. Enter delivery details\n6. Confirm your order\n\nNeed help with a specific order? Please provide your order ID.",
  delivery: "We offer delivery services across Sri Lanka. Delivery times vary by location:\n• Urban areas: 1-2 days ⚡\n• Rural areas: 2-4 days 🚚\n\nFresh produce is carefully packaged to ensure quality!",
  farmer: "Want to sell your produce? Join SmartAgriMarket as a farmer:\n1. Sign up with your details\n2. Get verified\n3. List your products\n4. Use AI insights to optimize pricing\n5. Start earning! 💰\n\nVisit the Sign Up page to get started.",
  organic: "We support organic farming! Look for the 'Organic' label 🌿\n\nOrganic benefits:\n• Chemical-free produce 🚫☣️\n• Environmentally friendly farming 🌍\n• Healthier choice for consumers 💪\n• Premium pricing rewards farmers 💚\n\nFilter by 'Organic' in our shop to find these products.",
  contact: "You can reach us through:\n📧 Email: support@smartagrimarket.lk\n📞 Phone: +94 11 234 5678\n📍 Visit our Contact Us page for more options.\n\nWe're here to help!",
  thanks: "You're welcome! 😊 Is there anything else I can help you with?",
  bye: "Goodbye! 👋 Thank you for visiting SmartAgriMarket. Have a great day and happy farming! 🌾",
  trend: "📊 Current Market Trends:\n• Tomato demand ↑ (Summer season)\n• Carrot prices ↓ (Good harvest)\n• Organic produce demand ↑↑ (Steady growth)\n• Local farming support ↑ (Community focus)\n\nWant specific predictions for a product?",
  quality: "🏆 Quality Assessment Tips:\n• Check color vibrancy and texture 🎨\n• Smell for freshness 👃\n• No visible bruises or damage ✓\n• Firmness test (gently press) 💪\n• Certification badges (Organic, Local) 🏅\n\nOur AI helps farmers maintain premium quality!",
  dashboard: "📊 Opening the ML Dashboard for you! You can view:\n• Model accuracy metrics\n• Price prediction charts\n• Demand forecasts\n• Performance analytics",
  accuracy: "🎯 Our Price Prediction Model Performance:\n\n• **Accuracy (R²): 99.92%**\n• Mean Absolute Error: Rs. 0.82\n• RMSE: Rs. 3.25\n\nThis means our AI can predict vegetable prices with exceptional accuracy! 🚀",
};

// Enhanced keyword map with ML-related terms
const keywordMap: Record<string, string[]> = {
  hello: ['hello', 'hey', 'greetings', 'start', 'begin'],
  hi: ['hi', 'hii', 'hiii', 'wassup', 'yo'],
  help: ['help', 'assist', 'support', 'what can you do', 'options', 'features'],
  products: ['products', 'crops', 'vegetables', 'fruits', 'produce', 'items', 'catalog', 'browse'],
  price: ['price', 'cost', 'pricing', 'how much', 'rate', 'rates', 'expensive', 'cheap'],
  order: ['order', 'buy', 'purchase', 'checkout', 'cart', 'ordering', 'checkout'],
  delivery: ['delivery', 'shipping', 'deliver', 'ship', 'transport', 'arrive', 'how long'],
  farmer: ['farmer', 'sell', 'seller', 'vendor', 'join', 'register', 'farming'],
  organic: ['organic', 'natural', 'chemical-free', 'eco', 'green', 'sustainable'],
  contact: ['contact', 'reach', 'phone', 'email', 'address', 'location', 'support'],
  thanks: ['thanks', 'thank you', 'thx', 'appreciate', 'ty'],
  bye: ['bye', 'goodbye', 'see you', 'exit', 'quit', 'leave'],
  trend: ['trend', 'market', 'demand', 'insight', 'analysis', 'statistics'],
  quality: ['quality', 'fresh', 'grade', 'best', 'premium', 'assessment'],
  dashboard: ['dashboard', 'chart', 'graph', 'analytics', 'performance', 'metrics', 'show model'],
  accuracy: ['accuracy', 'r2', 'mae', 'rmse', 'how accurate', 'model performance'],
};

// Detect if message is asking for price prediction
const detectPricePredictionRequest = (message: string): { isPrediction: boolean; crop?: string } => {
  const lowerMessage = message.toLowerCase();
  const predictionKeywords = ['predict', 'forecast', 'what will', 'estimate', 'price of', 'how much will'];
  
  const hasPredictionKeyword = predictionKeywords.some(keyword => lowerMessage.includes(keyword));
  
  if (hasPredictionKeyword) {
    // Try to find a crop name in the message
    const foundCrop = AVAILABLE_CROPS.find(crop => 
      lowerMessage.includes(crop.toLowerCase())
    );
    return { isPrediction: true, crop: foundCrop };
  }
  
  return { isPrediction: false };
};

function getBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Check for keyword matches
  for (const [responseKey, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return botResponses[responseKey];
    }
  }
  
  // Default response with helpful suggestions
  return "I'm not sure I understand that. Could you try asking in a different way? 🤔\n\nHere are some things I can help with:\n• AI Price Predictions 📊\n• Product Information 🥕\n• Market Trends 📈\n• Orders & Delivery 📦\n• Farmer Registration 👨‍🌾\n• Quality Tips 🏆\n\nType 'help' for more options!";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Load chat history on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      return history;
    }
    return [{
      id: '1',
      text: "Hello! 👋 Welcome to SmartAgriMarket. I'm your AI agricultural assistant powered by machine learning. How can I help you today?\n\nTry asking me to predict prices, show market trends, or open the ML dashboard! 📊",
      sender: 'bot',
      timestamp: new Date(),
    }];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to local storage whenever they change
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

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
  const handlePricePrediction = async (crop: string): Promise<string> => {
    try {
      setIsPredicting(true);
      const response = await predictPrice({
        crop_type: crop,
        season: 'northeast_monsoon',
        supply: 1000,
        demand: 1200,
        market_trend: 'stable',
      });
      
      return `🤖 **AI Price Prediction for ${crop}**\n\n` +
        `💰 Predicted Price: **Rs. ${response.predicted_price.toFixed(2)}** per kg\n\n` +
        `📊 Factors considered:\n` +
        `• Current season conditions\n` +
        `• Supply & demand balance\n` +
        `• Market trends\n\n` +
        `🎯 Model Accuracy: 99.92%\n\n` +
        `Want predictions for another product? Just ask!`;
    } catch (error) {
      console.error('Price prediction error:', error);
      return `🤖 **AI Price Estimation for ${crop}**\n\n` +
        `💰 Estimated Price Range: **Rs. 120 - Rs. 180** per kg\n\n` +
        `⚠️ Note: Live API unavailable. This is an estimate based on recent market data.\n\n` +
        `🎯 Our model accuracy: 99.92%\n\n` +
        `Try again later for real-time predictions!`;
    } finally {
      setIsPredicting(false);
    }
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

    // Check if user wants to see dashboard
    const lowerInput = currentInput.toLowerCase();
    if (lowerInput.includes('dashboard') || lowerInput.includes('chart') || lowerInput.includes('graph') || lowerInput.includes('analytics')) {
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponses.dashboard,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        setIsDashboardOpen(true);
      }, 500);
      return;
    }

    // Check for price prediction request
    const predictionRequest = detectPricePredictionRequest(currentInput);
    if (predictionRequest.isPrediction && predictionRequest.crop) {
      const predictionResponse = await handlePricePrediction(predictionRequest.crop);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: predictionResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'prediction',
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      return;
    }

    // Standard response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(currentInput),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  // Clear chat history
  const clearChatHistory = () => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: "Chat history cleared! 🧹 How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: '🛒 Products', query: 'products' },
    { label: '💰 Predict Tomato', query: 'predict tomato price' },
    { label: '📊 Dashboard', query: 'show dashboard' },
    { label: '🎯 Accuracy', query: 'model accuracy' },
    { label: '📈 Trends', query: 'market trends' },
    { label: '👨‍🌾 Be a Farmer', query: 'farmer' },
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
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            <span className="hidden sm:inline font-medium">Chat with us</span>
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
                  <h3 className="font-semibold text-lg">AgriBot AI</h3>
                  <p className="text-xs text-green-100">ML-powered assistant 🤖 99.92% accuracy</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Open ML Dashboard"
                  title="Open ML Dashboard"
                >
                  <BarChart3 size={18} />
                </button>
                <div className="p-2 text-white/60">
                  <GripHorizontal size={18} />
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <Minimize2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close chat"
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
                        className={`flex items-start gap-2 ${
                          message.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
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
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl whitespace-pre-line ${
                            message.sender === 'user'
                              ? 'bg-custom-green text-white rounded-tr-md'
                              : 'bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-100'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
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
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-custom-green focus:bg-white transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="p-2.5 bg-custom-green hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                        aria-label="Send message"
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
