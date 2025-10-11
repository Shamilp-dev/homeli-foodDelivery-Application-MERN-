import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Animated,
  Easing,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from '../../context/AuthContext';

// TypeScript interfaces
interface ErrorState {
  email?: string;
  signInPassword?: string;
  signUpName?: string;
  signUpEmail?: string;
  phone?: string;
  signUpPassword?: string;
  confirmPassword?: string;
}

// Production-ready animated vertical login/signup screen
export default function AnimatedLoginScreen() {
  
  const { login: authLogin } = useAuth();
  
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  // Local states for Sign In
  const [email, setEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Local states for Sign Up
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorState>({});

  // Sizes
  const gradientHeight = Math.min(360, height * 0.36);
  const signInFormHeight = Math.min(360, height * 0.44);
  const signUpFormHeight = Math.min(500, height * 0.62);
  const cardWidth = Math.min(380, width * 0.92);
  const cardLeft = (width - cardWidth) / 2;

  // Clear all forms and errors when switching modes
  const clearForms = () => {
    setEmail("");
    setSignInPassword("");
    setSignUpName("");
    setSignUpEmail("");
    setPhone("");
    setSignUpPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowPassword(false);
    setShowSignUpPassword(false);
    setShowConfirmPassword(false);
  };

  const toggle = () => {
    const toValue = isSignUp ? 0 : 1;
    clearForms();

    Animated.timing(anim, {
      toValue,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => setIsSignUp(!isSignUp));
  };

  // Gradient top position
  const gradientTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      height - gradientHeight - (Platform.OS === "ios" ? 0 : 0),
      0,
    ],
  });

  // Border radii animations
  const borderTopLeftRadius = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });
  const borderTopRightRadius = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });
  const borderBottomLeftRadius = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });
  const borderBottomRightRadius = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  // White card animations
  const formHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [signInFormHeight, signUpFormHeight],
  });
  const formTopSignIn = (height - signInFormHeight) / 2 - -20;
  const formTopSignUp = (height - signUpFormHeight) / 2 - 10;
  const formTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [formTopSignIn, formTopSignUp],
  });

  // Opacity animations
  const signInOpacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.2, 0],
  });
  const signUpOpacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.6, 1],
  });
  const signInTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const signUpTranslate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Show success message
  const showSuccessMessage = (message: string) => {
    Alert.alert("Success!", message, [{ text: "OK", style: "default" }], {
      cancelable: false,
    });
  };

  // Show error message
  const showErrorMessage = (title: string, message: string) => {
    Alert.alert(title || "Error", message, [{ text: "OK", style: "default" }], {
      cancelable: false,
    });
  };

  // Handle login with full validation
// Add this at the top of your login screen (index.tsx or LoginScreen.tsx)




// Update your handleLogin function - replace the existing one with this:
const handleLogin = async () => {
  if (isLoading) return;

  setErrors({});
  const newErrors: ErrorState = {};

  if (!email.trim()) {
    newErrors.email = "Please enter your email address";
  } else if (!validateEmail(email.trim())) {
    newErrors.email = "Please enter a valid email address";
  }

  if (!signInPassword.trim()) {
    newErrors.signInPassword = "Please enter your password";
  } else if (!validatePassword(signInPassword)) {
    newErrors.signInPassword = "Password must be at least 6 characters";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    const firstError = Object.values(newErrors)[0] as string;
    showErrorMessage("Validation Error", firstError);
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch("http://192.168.31.18:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: signInPassword,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success && data.token) {
      // ✅ Save to AuthContext
      await authLogin(
  {
    id: data.user.id || data.user._id,
    name: data.user.name,
    email: data.user.email,
    phone: data.user.phone || '',
  },
  data.token
);

      showSuccessMessage(`Welcome back, ${data.user.name}!`);

      setEmail("");
      setSignInPassword("");
      setErrors({});

      setTimeout(() => {
        router.replace("/(tabs)/dashboard");
      }, 1000);
    } else {
      showErrorMessage(
        "Login Failed",
        data.message || "Invalid email or password"
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    showErrorMessage(
      "Connection Error",
      "Unable to connect to server. Please check your internet connection."
    );
  } finally {
    setIsLoading(false);
  }
};

  // Handle signup with full validation
  const handleSignup = async () => {
    if (isLoading) return;

    setErrors({});
    const newErrors: ErrorState = {};

    // Validation
    if (!signUpName.trim()) {
      newErrors.signUpName = "Please enter your full name";
    } else if (signUpName.trim().length < 2) {
      newErrors.signUpName = "Name must be at least 2 characters";
    }

    if (!signUpEmail.trim()) {
      newErrors.signUpEmail = "Please enter your email address";
    } else if (!validateEmail(signUpEmail.trim())) {
      newErrors.signUpEmail = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Please enter your phone number";
    } else if (!validatePhone(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!signUpPassword.trim()) {
      newErrors.signUpPassword = "Please enter a password";
    } else if (!validatePassword(signUpPassword)) {
      newErrors.signUpPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signUpPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0] as string;
      showErrorMessage("Validation Error", firstError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://192.168.31.18:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: signUpName.trim(),
            email: signUpEmail.trim().toLowerCase(),
            phone: phone.trim(),
            password: signUpPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccessMessage(
          `Account created successfully!\nWelcome ${data.user.name}! You can now sign in.`
        );

        // Clear signup form
        setSignUpName("");
        setSignUpEmail("");
        setPhone("");
        setSignUpPassword("");
        setConfirmPassword("");
        setErrors({});

        // Switch to sign in mode
        setTimeout(() => {
          toggle();
        }, 2000);
      } else {
        showErrorMessage(
          "Registration Failed",
          data.message || "Failed to create account. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      showErrorMessage(
        "Connection Error",
        "Unable to connect to server. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["right", "left"]}>
      <View style={styles.container}>
        {/* Gradient card */}
        <Animated.View
          style={[
            styles.gradientWrapper,
            {
              height: gradientHeight,
              left: 0,
              right: 0,
              top: gradientTop,
              borderTopLeftRadius,
              borderTopRightRadius,
              borderBottomLeftRadius,
              borderBottomRightRadius,
            },
          ]}
        >
          <LinearGradient
            colors={["#fb3b06ff","#fb4f06ff" ,"#ff7e2eff"]}
            style={styles.gradientInner}
          >
            <Text style={styles.gradientTitle}>
              {isSignUp ? "Hello, Friend!" : "Welcome Back!"}
            </Text>
            <Text style={styles.gradientText}>
              {isSignUp
                ? "Register with your personal details to use all the app features"
                : "Login with your account to continue your journey"}
            </Text>

            <TouchableOpacity
              style={styles.gradientButton}
              onPress={toggle}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <Text style={styles.gradientButtonText}>
                {isSignUp ? "SIGN IN" : "SIGN UP"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* White card - Fixed shadow issues */}
        <Animated.View
          style={[
            styles.whiteCard,
            {
              width: cardWidth,
              left: cardLeft,
              height: formHeight,
              top: formTop,
            },
          ]}
        >
          {/* Sign In Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                bottom: 130,
                opacity: signInOpacity,
                transform: [{ translateY: signInTranslate }],
              },
            ]}
            pointerEvents={isSignUp ? "none" : "auto"}
          >
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.socialRow}>
              <MaterialIcons
                name="mail"
                size={22}
                color="#333"
                style={styles.socialIcon}
              />
              <MaterialIcons
                name="facebook"
                size={22}
                color="#333"
                style={styles.socialIcon}
              />
              <MaterialIcons
                name="apple"
                size={22}
                color="#333"
                style={styles.socialIcon}
              />
            </View>
            <Text style={styles.subtitle}>or use your email and password</Text>

            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  const newErrors = { ...errors };
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!isLoading}
            />

            <PasswordInput
              placeholder="Password"
              visible={showPassword}
              toggleVisible={() => setShowPassword(!showPassword)}
              value={signInPassword}
              onChangeText={(text) => {
                setSignInPassword(text);
                if (errors.signInPassword) {
                  const newErrors = { ...errors };
                  delete newErrors.signInPassword;
                  setErrors(newErrors);
                }
              }}
              hasError={!!errors.signInPassword}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.mainBtn, isLoading && styles.mainBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={[styles.mainBtnText, { marginLeft: 8 }]}>
                    SIGNING IN...
                  </Text>
                </View>
              ) : (
                <Text style={styles.mainBtnText}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Up Form */}
          <Animated.View
            style={[
              styles.formContainer,
              styles.signUpForm,
              {
                opacity: signUpOpacity,
                transform: [{ translateY: signUpTranslate }],
              },
            ]}
            pointerEvents={isSignUp ? "auto" : "none"}
          >
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.socialRow}>
              <MaterialIcons
                name="mail"
                size={22}
                color="#333"
                style={styles.socialIcon}
              />
              <MaterialIcons
                name="facebook"
                size={22}
                color="#333"
                style={styles.socialIcon}
              />
              <MaterialIcons
                name="apple"
                size={22}
                color="#333"
                style={styles.socialIcon}
              />
            </View>
            <Text style={styles.subtitle}>
              or use your email for registration
            </Text>

            <TextInput
              style={[styles.input, errors.signUpName && styles.inputError]}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={signUpName}
              onChangeText={(text) => {
                setSignUpName(text);
                if (errors.signUpName) {
                  const newErrors = { ...errors };
                  delete newErrors.signUpName;
                  setErrors(newErrors);
                }
              }}
              autoCapitalize="words"
              editable={!isLoading}
            />

            <TextInput
              style={[styles.input, errors.signUpEmail && styles.inputError]}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={signUpEmail}
              onChangeText={(text) => {
                setSignUpEmail(text);
                if (errors.signUpEmail) {
                  const newErrors = { ...errors };
                  delete newErrors.signUpEmail;
                  setErrors(newErrors);
                }
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!isLoading}
            />

            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) {
                  const newErrors = { ...errors };
                  delete newErrors.phone;
                  setErrors(newErrors);
                }
              }}
              keyboardType="phone-pad"
              editable={!isLoading}
            />

            <PasswordInput
              placeholder="Password"
              visible={showSignUpPassword}
              toggleVisible={() => setShowSignUpPassword(!showSignUpPassword)}
              value={signUpPassword}
              onChangeText={(text) => {
                setSignUpPassword(text);
                if (errors.signUpPassword) {
                  const newErrors = { ...errors };
                  delete newErrors.signUpPassword;
                  setErrors(newErrors);
                }
              }}
              hasError={!!errors.signUpPassword}
              editable={!isLoading}
            />

            <PasswordInput
              placeholder="Confirm Password"
              visible={showConfirmPassword}
              toggleVisible={() => setShowConfirmPassword(!showConfirmPassword)}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  const newErrors = { ...errors };
                  delete newErrors.confirmPassword;
                  setErrors(newErrors);
                }
              }}
              hasError={!!errors.confirmPassword}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.mainBtn, isLoading && styles.mainBtnDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={[styles.mainBtnText, { marginLeft: 8 }]}>
                    CREATING ACCOUNT...
                  </Text>
                </View>
              ) : (
                <Text style={styles.mainBtnText}>SIGN UP</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Enhanced Password Input Component
type PasswordInputProps = {
  placeholder: string;
  visible: boolean;
  toggleVisible: () => void;
  value: string;
  onChangeText: (text: string) => void;
  hasError?: boolean;
  editable?: boolean;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  visible,
  toggleVisible,
  value,
  onChangeText,
  hasError = false,
  editable = true,
}) => (
  <View style={[styles.inputWrapper, hasError && styles.inputError]}>
    <TextInput
      style={styles.inputField}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={!visible}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
    />
    <TouchableOpacity
      onPress={toggleVisible}
      style={styles.eyeButton}
      disabled={!editable}
    >
      <MaterialIcons
        name={visible ? "visibility" : "visibility-off"}
        size={20}
        color={editable ? "#666" : "#ccc"}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  gradientWrapper: {
    position: "absolute",
    overflow: "hidden",
    zIndex: 2,
  },
  gradientInner: {
    flex: 1,
    paddingTop: 90,
    paddingBottom: 98,
    paddingHorizontal: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  gradientText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
    maxWidth: 320,
  },
  gradientButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 26,
    marginTop: 6,
  },
  gradientButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  whiteCard: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    zIndex: 1,
    // Fixed shadow for both platforms
    ...Platform.select({
      ios: {
        shadowColor: "#fff",
      },
      android: {
        shadowColor: "#fff",
      },
    }),
  },
  formContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 25,
  },
  signUpForm: {
    top: 145, // Adjusted for better positioning
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
    marginTop: 20,
  },
  socialRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 15,
  },
  socialIcon: {
    marginHorizontal: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: "#ff4444",
    backgroundColor: "#fff5f5",
  },
  inputWrapper: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    padding: 4,
  },
  mainBtn: {
    marginTop: 12,
    backgroundColor: "#fe6232ff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  mainBtnDisabled: {
    backgroundColor: "#ffb199",
    opacity: 0.7,
  },
  mainBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPassword: {
    marginTop: 12,
  },
  forgotPasswordText: {
    color: "#666",
    fontSize: 14,
  },
});
