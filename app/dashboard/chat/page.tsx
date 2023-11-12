"use client";
import React, { useState, ChangeEvent } from "react";
import {
  Avatar,
  ActionIcon,
  TextInput,
  Button,
  Paper,
  Text,
  Group,
  Center,
  Divider,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import {
  IconSearch,
  IconArrowRight,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";
import classes from "./Chat.module.css";
import axios from "axios";

interface Message {
  type: "user" | "bot";
  text: string;
}

const WelcomeMessage: React.FC = () => {
  return (
    <Center style={{ paddingRight: "143px", paddingTop: "30px" }}>
      <Paper radius="sm" withBorder p="xl">
        <Text size="xl">Welcome to the AI Chatbot!</Text>
        <Text size="md">Start a conversation or try some examples.</Text>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleCheck size="1rem" />
            </ThemeIcon>
          }
        >
          <List.Item>Clone or download repository from GitHub</List.Item>
          <List.Item>Install dependencies with yarn</List.Item>
          <List.Item>
            To start development server run npm start command
          </List.Item>
          <List.Item>
            Run tests to make sure your changes do not break the build
          </List.Item>
          <List.Item
            icon={
              <ThemeIcon color="blue" size={24} radius="xl">
                <IconCircleDashed size="1rem" />
              </ThemeIcon>
            }
          >
            Submit a pull request once you are done
          </List.Item>
        </List>
      </Paper>
    </Center>
  );
};

const ChatBot: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim()) {
      setMessages([...messages, { type: "user", text: inputValue.trim() }]);
      setInputValue("");
      setLoading(true); // Set loading to true before making the API call

      try {
        // Make a POST request to the API with the user's message
        const response = await axios.post("http://127.0.0.1:80/chat/", {
          message: inputValue.trim(),
        });

        // Extract the bot's response from the API response
        const botResponse = response.data.response;

        // Update the chat messages with the bot's response
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", text: botResponse },
        ]);
      } catch (error) {
        console.error("Error fetching bot's response:", error);
        // Handle any errors (e.g., show an error message to the user)
      } finally {
        setLoading(false); // Set loading back to false after receiving the bot's response
      }
    }
  };

  return (
    <Center style={{ height: "calc(100vh - 60px)" }}>
      <div
        style={{
          width: "1200px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Chat messages container */}
        <div style={{ flexGrow: 1 }}>
          {messages.length === 0 && !loading ? (
            <WelcomeMessage />
          ) : (
            messages.map((message, index) => (
              <React.Fragment key={index}>
                <Paper style={{ margin: "10px 0", padding: "10px" }}>
                  <Group>
                    <Avatar
                      size={40}
                      color={message.type === "bot" ? "blue" : "teal"}
                    >
                      {message.type === "bot" ? "B" : "U"}
                    </Avatar>
                    <Text>{message.text}</Text>
                  </Group>
                </Paper>
                <Divider />
              </React.Fragment>
            ))
          )}
        </div>

        {/* Input container */}
        <div style={{ marginTop: "40px" }}>
          <Paper style={{ padding: "10px" }}>
            <Group>
              <form onSubmit={handleSendMessage}>
                <TextInput
                  radius="xl"
                  size="md"
                  placeholder="Ask a question"
                  value={inputValue}
                  onChange={handleInputChange}
                  rightSectionWidth={42}
                  leftSection={
                    <IconSearch
                      style={{ width: rem(18), height: rem(18) }}
                      stroke={1.5}
                    />
                  }
                  rightSection={
                    <ActionIcon
                      type="submit"
                      size={32}
                      radius="xl"
                      color={"red"}
                      variant="filled"
                    >
                      <IconArrowRight
                        style={{ width: rem(18), height: rem(18) }}
                        stroke={1.5}
                      />
                    </ActionIcon>
                  }
                  classNames={{
                    root: classes.chatwidth,
                  }}
                />
              </form>
            </Group>
          </Paper>
        </div>
      </div>
    </Center>
  );
};

export default ChatBot;
