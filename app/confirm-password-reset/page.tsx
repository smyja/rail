"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { usePasswordResetConfirmMutation } from "../../store/auth-api";
import {
  Container,
  Title,
  Paper,
  TextInput,
  PasswordInput,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { getCookie } from "../../store/cookie";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface FormValues {
  newpassword1: string;
  newpassword2: string;
  otp: string;
  email: string;
}

export default function PasswordResetConfirmPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>(""); // Specify type as string
  const { email } = useSelector((state:RootState) => state.email);

  const schema = z.object({
    newpassword1: z
      .string()
      .min(8, { message: "Password should be a minimum of 8 characters" }),
    newpassword2: z
      .string()
      .min(8, { message: "Password should be a minimum of 8 characters" }),
    otp: z.string(),
  });

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      newpassword1: "",
      newpassword2: "",
      otp: "",
      email: email,
    },
  });

  const [
    passwordResetConfirm,
    {
      data: passwordResetConfirmData,
      isError: isPasswordResetConfirmError,
      isSuccess: isPasswordResetConfirmSuccess,
      error: passwordResetConfirmError,
      isLoading: isPasswordResetConfirmLoading,
    },
  ] = usePasswordResetConfirmMutation();

  const handlePasswordResetConfirm = async (value: FormValues) => {
    console.log(value);
    passwordResetConfirm({
      otp: value.otp, // Pass otp value
      email: email,
      new_password1: value.newpassword1, // Use newpassword1
      new_password2: value.newpassword2, // Use newpassword2
    });
  };

  useEffect(() => {
    if (isPasswordResetConfirmError) {
      if (passwordResetConfirmError) {
        setError("Something went wrong");
      }
    }
    if (isPasswordResetConfirmSuccess) {
      router.push("/login");
    }
  }, [isPasswordResetConfirmError, isPasswordResetConfirmSuccess,passwordResetConfirmError, router]);

  return (
    <div>
      <form onSubmit={form.onSubmit(handlePasswordResetConfirm)}>
        <Container size={420} my={40}>
          <Title align="center">Password Reset Confirmation</Title>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              type="text"
              {...form.getInputProps("otp")}
              label="OTP"
              placeholder="Enter the OTP"
            />
            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              {...form.getInputProps("newpassword1")}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              {...form.getInputProps("newpassword2")}
              mt="md"
            />

            <Button
              fullWidth
              mt="xl"
              type="submit"
              loading={isPasswordResetConfirmLoading} // Use isPasswordResetConfirmLoading
              disabled={loading || isPasswordResetConfirmLoading} // Add isPasswordResetConfirmLoading
            >
              Reset Password
            </Button>

            {error && <p>{error}</p>}
          </Paper>
        </Container>
      </form>
    </div>
  );
}
