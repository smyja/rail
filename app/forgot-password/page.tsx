"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { usePasswordResetMutation } from "../../store/auth-api"; // Import the appropriate password reset mutation function
import {
  Container,
  Title,
  Paper,
  TextInput,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setEmail } from "../../store/email-slice";

interface FormValues {
  email: string;
}

export default function PasswordResetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
  });
  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      email: "",
    },
  });
  const dispatch = useDispatch();

  const [
    passwordReset,
    {
      isError: isPasswordResetError,
      isSuccess: isPasswordResetSuccess,
      error: passwordResetError,
      isLoading: isPasswordResetLoading,
    },
  ] = usePasswordResetMutation();

  const handlePasswordReset = async (values: FormValues) => {
    passwordReset(values);
  };

  useEffect(() => {
    if (isPasswordResetError) {
      if (passwordResetError) {
        setError("Something went wrong");
      }
    }
    if (isPasswordResetSuccess) {
      dispatch(setEmail(form.values.email));
      router.push("/confirm-password-reset");
    }
  }, [isPasswordResetError, isPasswordResetSuccess, passwordResetError, router]);

  return (
    <div>
      <form onSubmit={form.onSubmit(handlePasswordReset)}>
        <Container size={420} my={40}>
          <Title align="center">Password Reset</Title>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              type="email"
              {...form.getInputProps("email")}
              label="Email"
              placeholder="Enter your email"
            />

            <Button
              fullWidth
              mt="xl"
              type="submit"
              loading={isPasswordResetLoading}
              disabled={loading || isPasswordResetLoading}
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
