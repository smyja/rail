"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useVerfiyEmailResendMutation } from '../../store/auth-api'; // Import the appropriate resend email verification mutation function
import {
  Container,
  Title,
  Paper,
  TextInput,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from '@mantine/form';

interface FormValues {
    email: string;
  }
  
  export default function ResendEmailVerificationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
  
    const schema = z.object({
      email: z.string().email({ message: "Invalid email" }),
    });
    const form = useForm<FormValues>({
      validate: zodResolver(schema),
      initialValues: {
        email: "",
      },
    });
  
    const [
      resendEmailVerification,
      {
        isError: isResendEmailVerificationError,
        isSuccess: isResendEmailVerificationSuccess,
        error: resendEmailVerificationError,
        isLoading: isResendEmailVerificationLoading,
      },
    ] = useVerfiyEmailResendMutation();
  
    const handleResendEmailVerification = async (values: FormValues) => {
      resendEmailVerification(values);
    };
  
    useEffect(() => {
      if (isResendEmailVerificationError) {
        if (resendEmailVerificationError) {
          setError("Something went wrong");
        }
      }
      if (isResendEmailVerificationSuccess) {
        router.push("/email-verify");
      }
    }, [isResendEmailVerificationError, isResendEmailVerificationSuccess,resendEmailVerificationError, router]);
  
    return (
      <div>
        <form onSubmit={form.onSubmit(handleResendEmailVerification)}>
          <Container size={420} my={40}>
            <Title align="center">Resend Email Verification</Title>
  
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
                loading={isResendEmailVerificationLoading}
                disabled={loading || isResendEmailVerificationLoading}
              >
                Resend Verification Email
              </Button>
  
              {error && <p>{error}</p>}
            </Paper>
          </Container>
        </form>
      </div>
    );
  }
  