import { useState } from "react";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      // Redirect is handled by the root navigator on session change.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <Text className="mb-2 text-3xl font-bold text-white">Welcome back</Text>
        <Text className="mb-8 text-base text-neutral-400">
          Sign in to your MovieWatchlist account.
        </Text>

        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          className="mb-4 rounded-xl bg-neutral-900 px-4 py-3 text-white"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#737373"
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          className="mb-2 rounded-xl bg-neutral-900 px-4 py-3 text-white"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#737373"
          secureTextEntry
          value={password}
        />

        {error ? (
          <Text className="mb-2 text-sm text-red-400">{error}</Text>
        ) : null}

        <Pressable
          className="mt-4 items-center rounded-xl bg-white py-3 active:opacity-80"
          disabled={submitting}
          onPress={onSubmit}
        >
          {submitting ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text className="text-base font-semibold text-black">Sign in</Text>
          )}
        </Pressable>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-neutral-400">No account? </Text>
          <Link className="font-semibold text-white" href="/signup">
            Sign up
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
