'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useLogin } from '@/hooks';
import { useDispatch } from "react-redux";
import classes from "../global.module.css"
import { GoogleButton } from './GoogleButton';

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider
} from "@mantine/core";

interface FormValues {
  email: string;
  password: string;
}

export default function AuthenticationTitle() {


  const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
  });

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    initialValues: {
      email: "",
      password: "",
    },
  });
  console.log(form.values)
  
  const { setValue, isLoading, onChange, onSubmit,loginError } = useLogin({
    setValue: form.setValues,
    values: form.values,
  });
    return (
    <div>
        
 <form onSubmit={form.onSubmit(onSubmit)}>
  
  <Container size={420} my={40}>

    <Title ta="center" className={classes.h1}>Welcome back!</Title>

    <Text size="sm" ta="center" mt={5}>
      Do not have an account yet?{" "}
      <Anchor href="/signup" size="sm">
        Create account
      </Anchor>
    </Text>

    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
    <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        {/* <TwitterButton radius="xl">Twitter</TwitterButton> */}
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />
      <TextInput
        type="email"
        {...form.getInputProps("email")}
        label="Email"
        placeholder="Enter your email"
       
      
      />

      <PasswordInput
        label="Password"
        placeholder="Your password"
        {...form.getInputProps("password")}
        mt="md"
      />
      <Group justify="space-between" mt="md">
        <Checkbox label="Remember me" />
        <Anchor href="forgot-password" size="sm">
          Forgot password?
        </Anchor>
      </Group>
      <Button
        fullWidth
        mt="xl"
        type="submit"
        loading={isLoading} 
      >
        Sign in
      </Button>
    
      {loginError && <p>Failed to log in</p>}
    </Paper>
  </Container>
</form>

    </div>
  );
}
