import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Surface, Text, TextInput, Button, ActivityIndicator, HelperText } from 'react-native-paper';

interface LoginScreenProps {
  serverUrl: string;
  setServerUrl: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  errorMessage: string;
  handleLogin: () => void;
}

export default function LoginScreen({
  serverUrl,
  setServerUrl,
  username,
  setUsername,
  password,
  setPassword,
  loading,
  errorMessage,
  handleLogin,
}: LoginScreenProps) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Surface style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
          ERPNext Attendance
        </Text>
        <Text variant="bodyLarge" style={{ color: '#6e6e73', marginBottom: 24, textAlign: 'center' }}>
          Sign in to your organization account
        </Text>

        <TextInput
          label="ERPNext Server URL"
          value={serverUrl}
          onChangeText={setServerUrl}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="url"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Username / Email"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          autoCapitalize="none"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={{ marginBottom: 12 }}
        />

        {!!errorMessage && (
          <HelperText type="error" visible={true} style={{ marginBottom: 8 }}>
            {errorMessage}
          </HelperText>
        )}

        {loading ? (
          <ActivityIndicator animating size="large" color="#0066cc" style={{ marginVertical: 16 }} />
        ) : (
          <Button
            mode="contained"
            buttonColor="#0066cc"
            contentStyle={{ height: 48 }}
            onPress={handleLogin}
            style={{ marginTop: 8 }}
          >
            SIGN IN
          </Button>
        )}
      </Surface>
    </KeyboardAvoidingView>
  );
}