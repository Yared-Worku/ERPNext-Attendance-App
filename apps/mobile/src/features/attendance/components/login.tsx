import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { useLogin } from '../hooks/useLogin';

export default function LoginScreen() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const {
    serverUrl,
    setServerUrl,
    username,
    setUsername,
    password,
    setPassword,
    loading,
    errorMessage,
    handleLogin,
  } = useLogin();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          ERPNext Attendance
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to your organization account
        </Text>

        {/* ERPNext Server URL Input */}
        <TextInput
          label="ERPNext Server URL"
          value={serverUrl}
          onChangeText={setServerUrl}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="url"
          style={styles.input}
        />

        {/* Username Input */}
        <TextInput
          label="Username / Email"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Password Input */}
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

        {/* Error Message Display */}
        {!!errorMessage && (
          <HelperText type="error" visible={true} style={styles.error}>
            {errorMessage}
          </HelperText>
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Sign In
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  error: {
    marginBottom: 8,
  },
});