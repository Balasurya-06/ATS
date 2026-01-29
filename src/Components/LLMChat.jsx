import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import apiService from '../services/api.js';

function LLMChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [intelligenceContext, setIntelligenceContext] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const [suspiciousRes, statsRes] = await Promise.all([
                    apiService.makeRequest('/analysis/suspicious?limit=50'),
                    apiService.makeRequest('/stats')
                ]);

                if (suspiciousRes.success && statsRes.success) {
                    const profiles = suspiciousRes.data.profiles;
                    const contextData = {
                        systemStats: statsRes.data,
                        suspiciousProfiles: profiles.map(p => ({
                            name: p.name,
                            id: p.profileId,
                            riskLevel: p.radicalizationLevel,
                            score: p.suspicionScore,
                            linkages: p.linkageCount,
                            reasons: p.suspicionReasons || []
                        }))
                    };
                    setIntelligenceContext(JSON.stringify(contextData, null, 2));
                }
            } catch (error) {
                console.error('Failed to load intelligence context:', error);
            }
        };
        fetchSystemData();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const sendMessage = async () => {
        if (!input.trim() && !imageFile) return;

        const userMessage = {
            role: 'user',
            content: input,
            image: imagePreview,
            timestamp: new Date().toLocaleTimeString()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        
        const currentInput = input;
        const currentImage = imagePreview;
        setInput('');
        setIsLoading(true);

        try {
            let apiMessages = [];
            
            // System Context
            apiMessages.push({
                role: 'system',
                content: `You are an elite Intelligence Analyst for the ATS (Anti-Terror Squad).
                
                CURRENT INTELLIGENCE DATA:
                ${intelligenceContext}

                YOUR MISSION:
                1. Analyze the provided data to identify suspicious persons and groups.
                2. Explain WHY they are suspicious using the 'reasons' and 'score' fields.
                3. Identify linkages between people (e.g. "Person A linked to Person B via Phone").
                4. Answer user questions accurately based STRICTLY on this data.
                5. If asked about "why", cite the specific connection type (Phone, Location, Family) and strength.
                6. Use Markdown formatting to make your responses easy to read (Bold key names, use lists, tables if comparing).
                
                Keep responses concise, professional, and actionable.`
            });

            // History
            messages.forEach(msg => {
                const content = msg.image ? `${msg.content} [Image Uploaded]` : msg.content;
                apiMessages.push({ role: msg.role, content: content || '' });
            });

            // Current Message
            if (currentImage) {
                apiMessages.push({
                    role: 'user',
                    content: [
                        { type: 'text', text: currentInput.trim() || 'Analyze this evidence.' },
                        { type: 'image_url', image_url: { url: currentImage } }
                    ]
                });
            } else {
                apiMessages.push({
                    role: 'user',
                    content: currentInput.trim()
                });
            }

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'ATS Intelligence Assistant'
                },
                body: JSON.stringify({
                    model: 'liquid/lfm-2.5-1.2b-thinking:free',
                    messages: apiMessages
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0]?.message?.content || 'No response received';
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: assistantMessage,
                timestamp: new Date().toLocaleTimeString(),
                id: Date.now()
            }]);

            setImagePreview(null);
            setImageFile(null);

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ System Error: ${error.message}. Please check connection or API key.`,
                timestamp: new Date().toLocaleTimeString(),
                error: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // UI Components
    const BotAvatar = () => (
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)' }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
        </div>
    );

    const UserAvatar = () => (
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>👤</span>
        </div>
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f1f5f9', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
                    <span style={{ fontSize: '24px' }}>🛡️</span>
                </div>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                        ATS Intelligence AI
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '13px', fontWeight: '500' }}>
                            Secure Channel • Liquid LFM 2.5
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {messages.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6 }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px', background: '#e0e7ff', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</div>
                        <h3 style={{ color: '#475569', margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>Ready for Analysis</h3>
                        <p style={{ color: '#94a3b8', margin: 0, textAlign: 'center', maxWidth: '300px' }}>Authenticate suspects, analyze networks, and process intelligence data.</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        gap: '12px',
                        alignItems: 'flex-start'
                    }}>
                        {msg.role !== 'user' && <BotAvatar />}
                        
                        <div style={{
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            <div style={{
                                padding: '16px 20px',
                                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                background: msg.role === 'user' ? '#6366f1' : 'white',
                                color: msg.role === 'user' ? 'white' : '#1e293b',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                fontSize: '15px',
                                lineHeight: '1.6',
                                overflowWrap: 'break-word',
                                border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none'
                            }}>
                                {msg.image && (
                                    <img src={msg.image} alt="Uploaded" style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        display: 'block',
                                        border: '1px solid rgba(0,0,0,0.1)'
                                    }} />
                                )}
                                {msg.role === 'assistant' ? (
                                    <div className="markdown-content">
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({node, ...props}) => <h3 style={{fontSize: '18px', fontWeight: '700', marginTop: '16px', marginBottom: '8px'}} {...props} />,
                                                h2: ({node, ...props}) => <h4 style={{fontSize: '16px', fontWeight: '600', marginTop: '12px', marginBottom: '8px'}} {...props} />,
                                                h3: ({node, ...props}) => <h5 style={{fontSize: '15px', fontWeight: '600', marginTop: '10px', marginBottom: '6px'}} {...props} />,
                                                p: ({node, ...props}) => <p style={{margin: '0 0 8px 0'}} {...props} />,
                                                ul: ({node, ...props}) => <ul style={{paddingLeft: '20px', margin: '4px 0 12px 0'}} {...props} />,
                                                li: ({node, ...props}) => <li style={{marginBottom: '4px'}} {...props} />,
                                                strong: ({node, ...props}) => <strong style={{fontWeight: '700', color: '#0f172a'}} {...props} />,
                                                code: ({node, inline, ...props}) => inline 
                                                    ? <code style={{background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px', fontSize: '0.9em', fontFamily: 'monospace'}} {...props} />
                                                    : <code style={{display: 'block', background: '#f1f5f9', padding: '12px', borderRadius: '8px', overflowX: 'auto', margin: '8px 0', fontSize: '0.9em', fontFamily: 'monospace'}} {...props} />,
                                                table: ({node, ...props}) => <table style={{borderCollapse: 'collapse', width: '100%', margin: '12px 0', fontSize: '14px'}} {...props} />,
                                                th: ({node, ...props}) => <th style={{textAlign: 'left', padding: '8px', borderBottom: '2px solid #e2e8f0', color: '#64748b'}} {...props} />,
                                                td: ({node, ...props}) => <td style={{padding: '8px', borderBottom: '1px solid #f1f5f9'}} {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div>{msg.content}</div>
                                )}
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', margin: msg.role === 'user' ? '0 4px 0 0' : '0 0 0 4px' }}>
                                {msg.timestamp}
                            </span>
                        </div>
                        
                        {msg.role === 'user' && <UserAvatar />}
                    </div>
                ))}

                {isLoading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px' }}>
                        <BotAvatar />
                        <div style={{
                            padding: '16px 20px',
                            borderRadius: '20px 20px 20px 4px',
                            background: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0'
                        }}>
                             <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '24px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '24px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '8px',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)'; }}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; } }}
                tabIndex={-1}
                >
                    {imagePreview && (
                        <div style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <button onClick={removeImage} style={{
                                position: 'absolute', top: '4px', left: '104px', width: '24px', height: '24px', borderRadius: '50%', 
                                background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>×</button>
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" style={{
                            padding: '10px', borderRadius: '12px', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#1e293b'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
                        title="Upload Image"
                        >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </label>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your intelligence query..."
                            rows="1"
                            style={{
                                flex: 1,
                                padding: '12px 4px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '15px',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: 'inherit',
                                color: '#1e293b',
                                minHeight: '24px',
                                maxHeight: '120px'
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={isLoading || (!input.trim() && !imageFile)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '12px',
                                border: 'none',
                                background: (isLoading || (!input.trim() && !imageFile)) ? '#cbd5e1' : '#6366f1',
                                color: 'white',
                                cursor: (isLoading || (!input.trim() && !imageFile)) ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                        >
                            <span>Send</span>
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                .markdown-content strong { color: #1e293b; font-weight: 700; }
                .markdown-content a { color: #6366f1; text-decoration: none; }
                .markdown-content a:hover { text-decoration: underline; }
            `}</style>
        </div>
    );
}

export default LLMChat;
