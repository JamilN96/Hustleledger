import { useRef, useState } from 'react';
import { View, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TextInput, ActivityIndicator, Chip } from 'react-native-paper';
import GlassCard from './GlassCard';
import HLButton from './HLButton';
import { useColors, spacing } from '../lib/theme';

export default function AIChat() {
  const colors = useColors();
  const [messages, setMessages] = useState([
    { id: 'sys1', role: 'assistant', text: 'Hey! What money goal are you chasing this week?' }
  ]);
  const [input, setInput] = useState('Help me save $200 this month.');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const send = async () => {
    if (!input.trim()) return;
    const key = globalThis.OPENAI_API_KEY;
    const userMsg = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (!key) throw new Error('Missing OpenAI API key');

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.4,
          messages: [
            { role: 'system', content: 'You are a concise, practical personal finance coach. Use bullet points, be specific.' },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: userMsg.text }
          ],
        }),
      });
      const json = await res.json();
      const text = json?.choices?.[0]?.message?.content || 'No response.';
      setMessages((m) => [...m, { id: `${Date.now()}a`, role: 'assistant', text }]);
    } catch (e) {
      setMessages((m) => [...m, { id: `${Date.now()}e`, role: 'assistant', text: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  };

  return (
    <GlassCard style={{ marginTop: spacing(2) }} accessibilityLabel="AI money chat">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing(1) }}>
        <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18 }}>AI Money Copilot</Text>
        <Chip
          mode="outlined"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: colors.accent2 }}
          textStyle={{ color: colors.accent2, fontWeight: '600' }}
        >
          GPT-4o mini
        </Chip>
      </View>
      <Text style={{ color: colors.subtext, marginBottom: spacing(1.5), lineHeight: 18 }}>
        Ask anything about cash flow, savings hacks, or negotiating better rates. Ledger AI keeps receipts ready.
      </Text>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: spacing(1), alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
            <LinearGradient
              colors={item.role === 'user'
                ? [colors.accent1 + '33', colors.accent2 + '22']
                : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16 }}
            >
              <Text
                style={{
                  color: colors.text,
                  padding: spacing(1.25),
                  fontSize: 14,
                  lineHeight: 20,
                }}
                accessibilityRole="text"
              >
                {item.text}
              </Text>
            </LinearGradient>
          </View>
        )}
      />

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a money question…"
        mode="flat"
        style={{ marginTop: spacing(1), marginBottom: spacing(1), backgroundColor: 'transparent' }}
        theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
        onSubmitEditing={send}
        accessibilityLabel="Ask the AI money copilot"
      />

      <HLButton title={loading ? 'Thinking…' : 'Send'} onPress={send} accessibilityLabel="Send message" />
      {loading && <ActivityIndicator style={{ marginTop: spacing(1) }} />}
    </GlassCard>
  );
}
