import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
      <Surface style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          ERPNext Attendance
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to your organization account
        </Text>

        <TextInput
          label="ERPNext Server URL"
          placeholder="https://your-domain.com"
          value={serverUrl}
          onChangeText={setServerUrl}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="url"
          style={styles.input}
        />

        <TextInput
          label="Username / Email"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
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
          style={styles.input}
        />

        {!!errorMessage && (
          <HelperText type="error" visible={true} style={styles.error}>
            {errorMessage}
          </HelperText>
        )}

        {loading ? (
          <ActivityIndicator animating size="large" color="#0066cc" style={styles.loader} />
        ) : (
          <Button
            mode="contained"
            buttonColor="#0066cc"
            contentStyle={{ height: 48 }}
            onPress={handleLogin}
            style={styles.button}
          >
            SIGN IN
          </Button>
        )}
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6e6e73',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  error: {
    marginBottom: 8,
  },
  loader: {
    marginVertical: 16,
  },
});