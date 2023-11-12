"use client";
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useRegister } from '@/hooks';

import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Group
} from "@mantine/core";


interface FormValues {
  email: string;
  password: string;
  re_password: string;
  first_name: string;
  last_name: string;
}

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = z.object({
    password: z
      .string()
      .min(8, { message: "Password should be a minimum of 8 characters" }),
    re_password: z
      .string()
      .min(8, { message: "Password should be a minimum of 8 characters" }),
    email: z.string().email({ message: "Invalid email" }),
  });
  // Use your custom hook

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      email: "",
      password: "",
      re_password: "",
      first_name: "",
      last_name: "",
    },
  });

  console.log(form.values)
  
  const { setValue, isLoading, onChange, onSubmit,signupError } = useRegister({
    setValue: form.setValues,
    values: form.values,
  });

  return (
    <div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Container size={420} my={40}>
          <Title
            ta="center"
     
          >
            Create an Account
          </Title>

          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{" "}
            <Anchor<"a"> href="/login" size="sm">
              Log in
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Group grow>
            <TextInput
              data-autofocus
              required
              placeholder="Your first name"
              label="First name"
              {...form.getInputProps('first_name')}
            />

            <TextInput
              required
              placeholder="Your last name"
              label="Last name"
              {...form.getInputProps('last_name')}
              
            />
          </Group>
            <TextInput
              type="text"
              {...form.getInputProps("email")}
              label="Email"
              placeholder="Enter your email"
              mt="md"
            />

            <PasswordInput
              label="Password"
              placeholder="Choose a password"
              {...form.getInputProps("password")}
              mt="md"
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              {...form.getInputProps("re_password")}
              mt="md"
            />

            <Button
              fullWidth
              mt="xl"
              type="submit"
              loading={isLoading}
              
            >
              Sign Up
            </Button>

            {signupError && <p>Failed to Signup</p>}
          </Paper>
        </Container>
      </form>
    </div>
  );
}
