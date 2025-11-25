import { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authService } from '@/services/auth';
import { cn } from '@/lib/utils';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChat = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(authService.getState().user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = authService.subscribe((state) => {
      setCurrentUser(state.user);
    });

    // Initialize with welcome message
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    return () => {
      unsubscribeAuth();
    };
  }, [i18n.language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = () => {
    const welcomeMessages: Record<string, string> = {
      en: "Hello! I'm your AI fishing assistant. Ask me anything about fishing, species identification, best fishing spots, or fishing techniques!",
      ta: "வணக்கம்! நான் உங்கள் AI மீன்பிடி உதவியாளர். மீன்பிடித்தல், இனங்கள் அடையாளம், சிறந்த மீன்பிடி இடங்கள் அல்லது மீன்பிடி நுட்பங்கள் பற்றி எதையும் கேளுங்கள்!",
      te: "హలో! నేను మీ AI ఫిషింగ్ అసిస్టెంట్. చేపలు పట్టడం, జాతుల గుర్తింపు, ఉత్తమ చేపల పట్టే ప్రదేశాలు లేదా చేపల పట్టే పద్ధతుల గురించి ఏదైనా అడగండి!",
      hi: "नमस्ते! मैं आपका AI मछली पकड़ने का सहायक हूँ। मछली पकड़ने, प्रजाति पहचान, सर्वोत्तम मछली पकड़ने के स्थान, या मछली पकड़ने की तकनीकों के बारे में कुछ भी पूछें!",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಮೀನುಗಾರಿಕೆ ಸಹಾಯಕ. ಮೀನುಗಾರಿಕೆ, ಜಾತಿ ಗುರುತಿಸುವಿಕೆ, ಉತ್ತಮ ಮೀನುಗಾರಿಕೆ ಸ್ಥಳಗಳು ಅಥವಾ ಮೀನುಗಾರಿಕೆ ತಂತ್ರಗಳ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ!",
      ml: "ഹലോ! ഞാൻ നിങ്ങളുടെ AI മത്സ്യബന്ധന സഹായി. മത്സ്യബന്ധനം, ജാതി തിരിച്ചറിയൽ, മികച്ച മത്സ്യബന്ധന സ്ഥലങ്ങൾ അല്ലെങ്കിൽ മത്സ്യബന്ധന സാങ്കേതികതകൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കൂ!",
      gu: "નમસ્તે! હું તમારો AI માછીમારી સહાયક છું. માછીમારી, પ્રજાતિ ઓળખ, શ્રેષ્ઠ માછીમારી સ્થાનો અથવા માછીમારી તકનીકો વિશે કંઈપણ પૂછો!",
      mwr: "नमस्ते! मैं आपका AI मछली पकड़ने का सहायक हूँ। मछली पकड़ने, प्रजाति पहचान, सर्वोत्तम मछली पकड़ने के स्थान, या मछली पकड़ने की तकनीकों के बारे में कुछ भी पूछें!",
      bn: "হ্যালো! আমি আপনার AI মাছ ধরা সহায়ক। মাছ ধরা, প্রজাতি সনাক্তকরণ, সেরা মাছ ধরার স্থান বা মাছ ধরার কৌশল সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন!",
      pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਮੱਛੀ ਫੜਨ ਵਾਲਾ ਸਹਾਇਕ ਹਾਂ। ਮੱਛੀ ਫੜਨ, ਜਾਤੀ ਪਛਾਣ, ਸਭ ਤੋਂ ਵਧੀਆ ਮੱਛੀ ਫੜਨ ਦੀਆਂ ਥਾਵਾਂ ਜਾਂ ਮੱਛੀ ਫੜਨ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ!",
      mr: "नमस्कार! मी तुमचा AI मासेमारी सहाय्यक आहे। मासेमारी, प्रजाती ओळख, सर्वोत्तम मासेमारी स्थाने किंवा मासेमारी तंत्रे याबद्दल काहीही विचारा!",
      or: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର AI ମତ୍ସ୍ୟ ସହାୟକ | ମତ୍ସ୍ୟ ଶିକାର, ଜାତି ଚିହ୍ନଟ, ସର୍ବୋତ୍ତମ ମତ୍ସ୍ୟ ସ୍ଥାନ କିମ୍ବା ମତ୍ସ୍ୟ କୌଶଳ ବିଷୟରେ କିଛି ପଚାରନ୍ତୁ!"
    };
    return welcomeMessages[i18n.language] || welcomeMessages.en;
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const language = i18n.language;
    
    // Simple keyword-based responses in different languages
    const lowerMessage = userMessage.toLowerCase();
    
    // Fishing technique responses
    if (lowerMessage.includes('technique') || lowerMessage.includes('method') || lowerMessage.includes('how to')) {
      const responses: Record<string, string[]> = {
        en: [
          "For beginners, I recommend starting with bottom fishing or float fishing. Use live bait like worms or small fish for better results.",
          "Night fishing can be very productive! Use glow sticks or LED lights to attract fish. Make sure you have proper lighting for safety.",
          "Trolling is great for catching larger fish. Maintain a steady speed and vary your depth until you find where the fish are feeding."
        ],
        ta: [
          "ஆரம்பநிலையினருக்கு, கீழ் மீன்பிடித்தல் அல்லது மிதவை மீன்பிடித்தல் பரிந்துரைக்கப்படுகிறது. சிறந்த முடிவுகளுக்கு புழுக்கள் அல்லது சிறிய மீன்கள் போன்ற உயிருள்ள தூண்டிலைப் பயன்படுத்தவும்.",
          "இரவு மீன்பிடித்தல் மிகவும் உற்பத்தியாக இருக்கும்! மீன்களை ஈர்க்க ஒளிரும் குச்சிகள் அல்லது LED விளக்குகளைப் பயன்படுத்தவும்.",
        ],
        hi: [
          "शुरुआती लोगों के लिए, मैं तल मछली पकड़ने या फ्लोट मछली पकड़ने से शुरुआत करने की सलाह देता हूं। बेहतर परिणामों के लिए कीड़े या छोटी मछलियों जैसे जीवित चारा का उपयोग करें।",
          "रात में मछली पकड़ना बहुत उत्पादक हो सकता है! मछली को आकर्षित करने के लिए ग्लो स्टिक या LED लाइट का उपयोग करें।",
        ]
      };
      
      const langResponses = responses[language] || responses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
    
    // Species identification
    if (lowerMessage.includes('species') || lowerMessage.includes('fish') || lowerMessage.includes('identify')) {
      const responses: Record<string, string[]> = {
        en: [
          "Use the Analyze feature in the app to identify fish species! The AI can recognize over 50 common species with high accuracy.",
          "Common Indian coastal species include Mackerel, Pomfret, Kingfish, Tuna, and Sardines. Each has distinct markings and characteristics.",
          "Upload a clear photo of your catch in the Analyze section, and I'll help identify the species with detailed information about habitat and characteristics."
        ],
        ta: [
          "மீன் இனங்களை அடையாளம் காண பயன்பாட்டில் பகுப்பாய்வு அம்சத்தைப் பயன்படுத்தவும்! AI 50க்கும் மேற்பட்ட பொதுவான இனங்களை அதிக துல்லியத்துடன் அடையாளம் காண முடியும்.",
          "பொதுவான இந்திய கடலோர இனங்களில் கானாங்கெளுத்தி, வாவல், சீலா, சூரை மற்றும் மத்தி ஆகியவை அடங்கும்.",
        ],
        hi: [
          "मछली प्रजातियों की पहचान करने के लिए ऐप में विश्लेषण सुविधा का उपयोग करें! AI उच्च सटीकता के साथ 50+ सामान्य प्रजातियों को पहचान सकता है।",
          "सामान्य भारतीय तटीय प्रजातियों में मैकेरल, पोम्फ्रेट, किंगफिश, टूना और सार्डिन शामिल हैं।",
        ]
      };
      
      const langResponses = responses[language] || responses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
    
    // Location/spot recommendations
    if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('spot')) {
      const responses: Record<string, string[]> = {
        en: [
          "Check the Map view to see popular fishing spots and catches from other fishermen in your area. You can filter by species and recent activity.",
          "Early morning (4-7 AM) and evening (5-8 PM) are generally the best times for coastal fishing. Fish are more active during these cooler periods.",
          "Rocky shores and estuaries are excellent spots for diverse species. Always check local regulations and weather conditions before heading out."
        ],
        ta: [
          "உங்கள் பகுதியில் உள்ள பிற மீனவர்களிடமிருந்து பிரபலமான மீன்பிடி இடங்கள் மற்றும் பிடிப்புகளைக் காண மேப் காட்சியைப் பார்க்கவும்.",
          "அதிகாலை (காலை 4-7) மற்றும் மாலை (மாலை 5-8) பொதுவாக கடலோர மீன்பிடிக்க சிறந்த நேரங்கள்.",
        ],
        hi: [
          "अपने क्षेत्र में अन्य मछुआरों से लोकप्रिय मछली पकड़ने के स्थानों और पकड़ों को देखने के लिए मानचित्र दृश्य देखें।",
          "सुबह जल्दी (सुबह 4-7) और शाम (शाम 5-8) आम तौर पर तटीय मछली पकड़ने के लिए सबसे अच्छा समय है।",
        ]
      };
      
      const langResponses = responses[language] || responses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
    
    // Weather and conditions
    if (lowerMessage.includes('weather') || lowerMessage.includes('condition') || lowerMessage.includes('forecast')) {
      const responses: Record<string, string[]> = {
        en: [
          "Check the Weather tab in World's View for detailed forecasts. Avoid fishing during storms or high wind conditions for safety.",
          "Overcast days can be excellent for fishing! Fish tend to be more active when there's cloud cover. Just make sure it's not stormy.",
          "Monitor tide changes - many species feed more actively during incoming tides. The app can help you track these patterns."
        ],
        ta: [
          "விரிவான முன்னறிவிப்புகளுக்கு World's View இல் வானிலை தாவலைச் சரிபார்க்கவும். பாதுகாப்பிற்காக புயல் அல்லது அதிக காற்று நிலைகளின் போது மீன்பிடிப்பதைத் தவிர்க்கவும்.",
        ],
        hi: [
          "विस्तृत पूर्वानुमानों के लिए World's View में मौसम टैब देखें। सुरक्षा के लिए तूफान या उच्च हवा की स्थिति के दौरान मछली पकड़ने से बचें।",
        ]
      };
      
      const langResponses = responses[language] || responses.en;
      return langResponses[Math.floor(Math.random() * langResponses.length)];
    }
    
    // Default responses
    const defaultResponses: Record<string, string[]> = {
      en: [
        "That's an interesting question! I can help you with fishing techniques, species identification, best fishing spots, weather conditions, and equipment recommendations. What would you like to know?",
        "I'm here to help with all things fishing! Feel free to ask about techniques, species, locations, or check out the Analyze feature to identify your catches.",
        "Great question! You can use the app's features to track your catches, identify species, find fishing spots on the map, and connect with other fishermen in the community."
      ],
      ta: [
        "அது ஒரு சுவாரஸ்யமான கேள்வி! மீன்பிடி நுட்பங்கள், இனங்கள் அடையாளம், சிறந்த மீன்பிடி இடங்கள், வானிலை நிலைமைகள் மற்றும் உபகரண பரிந்துரைகள் ஆகியவற்றில் நான் உங்களுக்கு உதவ முடியும். நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
      ],
      hi: [
        "यह एक दिलचस्प सवाल है! मैं मछली पकड़ने की तकनीकों, प्रजाति पहचान, सर्वोत्तम मछली पकड़ने के स्थानों, मौसम की स्थिति और उपकरण सिफारिशों में आपकी मदद कर सकता हूं। आप क्या जानना चाहेंगे?",
      ]
    };
    
    const langResponses = defaultResponses[language] || defaultResponses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(newMessage);
      
      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-full">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{t('feed.aiChat')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('feed.community')} AI Assistant
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 items-start",
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className={cn(
                "h-8 w-8",
                message.role === 'assistant' && "bg-gradient-primary"
              )}>
                <AvatarFallback className={cn(
                  message.role === 'assistant' ? "bg-gradient-primary text-white" : "bg-primary/10 text-primary"
                )}>
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    currentUser?.name.slice(0, 2).toUpperCase()
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "flex-1 px-4 py-3 rounded-2xl max-w-[80%]",
                  message.role === 'user'
                    ? "bg-gradient-primary text-white ml-auto"
                    : "bg-muted/50"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 items-start">
              <Avatar className="h-8 w-8 bg-gradient-primary">
                <AvatarFallback className="bg-gradient-primary text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 px-4 py-3 rounded-2xl bg-muted/50 max-w-[80%]">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('communityChat.typeMessage').replace(' (images not allowed)', '')}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
