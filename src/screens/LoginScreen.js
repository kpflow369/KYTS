import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState('phone'); // 'phone' | 'otp'
  const [otp, setOtp] = useState('');
  const [otpSentMsg, setOtpSentMsg] = useState('');

  const handleSendOtp = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setOtpSentMsg(`OTP sent to +91 ${phone}`);
    setTimeout(() => setOtpSentMsg(''), 3000);
    setStage('otp');
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification
    navigation.navigate('ConnectWallet');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kav}>
        {/* Success toast */}
        {otpSentMsg !== '' && (
          <View style={styles.toast}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.toastText}>{otpSentMsg}</Text>
          </View>
        )}

        {stage === 'phone' ? (
          <View style={styles.content}>
            {/* Back -> only if we had previous */}
            <View style={styles.iconBox}>
              <Ionicons name="call" size={40} color="#ff4444" />
            </View>

            <Text style={styles.title}>Enter your phone number</Text>
            <Text style={styles.subtitle}>We'll send you a verification code</Text>

            {/* Phone Input Row */}
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                placeholderTextColor="#555"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleSendOtp} activeOpacity={0.85}>
              <LinearGradient colors={['#ff4444', '#cc2222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                <Text style={styles.btnText}>Send OTP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStage('phone')}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.iconBox}>
              <Ionicons name="call" size={40} color="#ff4444" />
            </View>

            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>Sent to +91 {phone}</Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter 4-digit OTP"
              placeholderTextColor="#555"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
            />

            <TouchableOpacity style={styles.btn} onPress={handleVerifyOtp} activeOpacity={0.85}>
              <LinearGradient colors={['#ff4444', '#cc2222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                <Text style={styles.btnText}>Verify OTP</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStage('phone')} style={{ marginTop: 8 }}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  kav: { flex: 1 },
  toast: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 99,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  toastText: { color: '#2e7d32', fontWeight: '600', fontSize: 14 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: '#2d0505',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#777',
    fontSize: 15,
    marginBottom: 36,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  countryCode: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  countryCodeText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  phoneInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 16,
  },
  otpInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 18,
    letterSpacing: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  btnGradient: {
    paddingVertical: 17,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  resendText: {
    color: '#ff4444',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 8,
  },
});
