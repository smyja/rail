"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useVerfiyEmailMutation } from "../../store/auth-api";
import {
  Container,
  Title,
  Paper,
  TextInput,
  Button,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface FormValues {
    email: string;
    otp: string;
  }

  export default function EmailVerify() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const { email } = useSelector((state:RootState) => state.email);
  
    const schema = z.object({
      email: z.string().email({ message: "Invalid email" }),
      otp: z.string(),
    });
    
    const form = useForm<FormValues>({
      validate: zodResolver(schema),
      initialValues: {
        email: email,
        otp: "",
      },
    });
  
    const [
      emailVerification,
      {
        isError: isEmailVerificationError,
        isSuccess: isEmailVerificationSuccess,
        isLoading: isEmailVerificationLoading,
      },
    ] = useVerfiyEmailMutation();
  
    const handleEmailVerification = async (values: FormValues) => {
      emailVerification(values);
    };
  
    useEffect(() => {
      if (isEmailVerificationError) {
        setError("Something went wrong");
      }
      if (isEmailVerificationSuccess) {
        router.push("/login");
      }
    }, [isEmailVerificationError, isEmailVerificationSuccess, router]);
  
    return (
      <div>
        <form onSubmit={form.onSubmit(handleEmailVerification)}>
          <Container size={420} my={40}>
            <Title align="center">Email Verification</Title>
  
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
              
              <TextInput
                type="text"
                {...form.getInputProps("otp")}
                label="OTP"
                placeholder="Enter the OTP"
              />
  
              <Button
                fullWidth
                mt="xl"
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Verify Email
              </Button>
  
              {error && <p>{error}</p>}
              <Button
                fullWidth
                mt="md"
                variant="outline"
                loading={isEmailVerificationLoading}
                onClick={() => router.push("/resend-email-verification")}
              >
                Resend
              </Button>
            </Paper>
          </Container>
        </form>
      </div>
    );
  }
  