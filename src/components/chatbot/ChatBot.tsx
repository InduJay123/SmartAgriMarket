import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, GripHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

// Predefined responses for common agricultural queries
const botResponses: Record<string, string> = {
  hello: "Hello! 👋 Welcome to SmartAgriMarket. I'm your agricultural assistant. How can I help you today?",
  hi: "Hi there! 🌱 I'm here to help you with your agricultural needs. What would you like to know?",
  help: "I can help you with:\n• Finding fresh produce and crops\n• Understanding pricing and market trends\n• Connecting with local farmers\n• Placing and tracking orders\n• Agricultural tips and advice\n\nJust ask me anything!",
  products: "We have a wide variety of fresh agricultural products including:\n• Vegetables (tomatoes, carrots, potatoes, etc.)\n• Fruits (mangoes, bananas, oranges, etc.)\n• Grains and cereals\n• Spices and herbs\n\nVisit our Shop to browse all products!",
  price: "Our prices are set directly by farmers, ensuring fair trade. Prices may vary based on:\n• Seasonality\n• Quality grade\n• Quantity ordered\n• Location\n\nCheck individual product pages for current pricing.",
  order: "To place an order:\n1. Browse products in the Shop\n2. Add items to your cart\n3. Review your cart\n4. Proceed to checkout\n5. Enter delivery details\n6. Confirm your order\n\nNeed help with a specific order? Please provide your order ID.",
  delivery: "We offer delivery services across Sri Lanka. Delivery times vary by location:\n• Urban areas: 1-2 days\n• Rural areas: 2-4 days\n\nFresh produce is carefully packaged to ensure quality!",
  farmer: "Want to sell your produce? Join SmartAgriMarket as a farmer:\n1. Sign up with your details\n2. Get verified\n3. List your products\n4. Start selling!\n\nVisit the Sign Up page to get started.",
  organic: "We support organic farming! Look for the 'Organic' label on products. Organic produce is:\n• Chemical-free\n• Environmentally friendly\n• Healthier choice\n\nFilter by 'Organic' in our shop to find these products.",
  contact: "You can reach us through:\n📧 Email: support@smartagrimarket.lk\n📞 Phone: +94 11 234 5678\n📍 Visit our Contact Us page for more options.\n\nWe're here to help!",
  thanks: "You're welcome! 😊 Is there anything else I can help you with?",
  bye: "Goodbye! 👋 Thank you for visiting SmartAgriMarket. Have a great day and happy farming! 🌾",
};

// Keywords for matching
const keywordMap: Record<string, string[]> = {
  hello: ['hello', 'hey', 'greetings'],
  hi: ['hi', 'hii', 'hiii'],
  help: ['help', 'assist', 'support', 'what can you do', 'options'],
  products: ['products', 'crops', 'vegetables', 'fruits', 'produce', 'items', 'catalog'],
  price: ['price', 'cost', 'pricing', 'how much', 'rate', 'rates', 'expensive', 'cheap'],
  order: ['order', 'buy', 'purchase', 'checkout', 'cart', 'ordering'],
  delivery: ['delivery', 'shipping', 'deliver', 'ship', 'transport', 'arrive'],
  farmer: ['farmer', 'sell', 'seller', 'vendor', 'join', 'register as farmer'],
  organic: ['organic', 'natural', 'chemical-free', 'eco', 'green'],
  contact: ['contact', 'reach', 'phone', 'email', 'address', 'location'],
  thanks: ['thanks', 'thank you', 'thx', 'appreciate'],
  bye: ['bye', 'goodbye', 'see you', 'exit', 'quit'],
};

function getBotResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Check for keyword matches
  for (const [responseKey, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return botResponses[responseKey];
    }
  }
  
  // Default response
  return "I'm not sure I understand that. Could you try asking in a different way? 🤔\n\nHere are some things I can help with:\n• Products and pricing\n• Orders and delivery\n• Becoming a farmer/seller\n• Organic produce\n• Contact information\n\nType 'help' for more options!";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 Welcome to SmartAgriMarket. I'm your agricultural assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: '🛒 Products', query: 'products' },
    { label: '💰 Pricing', query: 'price' },
    { label: '🚚 Delivery', query: 'delivery' },
    { label: '👨‍🌾 Become a Farmer', query: 'farmer' },
  ];

  return (
    <>
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
                  <h3 className="font-semibold text-lg">AgriBot</h3>
                  <p className="text-xs text-green-100">Always here to help 🌱</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
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
