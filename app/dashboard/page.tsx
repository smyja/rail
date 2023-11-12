"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextInput,
  ActionIcon,
  useMantineTheme,
  rem,
  Loader,
  Paper,
  Text,
  Avatar,
  Anchor,
  Group,
  Center,
  Space,
  Skeleton,
  Grid,
  Badge,
  List,
  Image,
  ThemeIcon,
  Title,
  Button,
  Modal

} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import {
  IconSearch,
  IconArrowRight,
  IconFolderSearch,
  IconBrandNotion,
  IconMail,
  IconBrandAirtable,
  IconFile,
  IconWorldWww
} from "@tabler/icons-react";
import classes from "./Search.module.css";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";





type ApiResponse = {
  answer: string;
  references: string[];
  similar_questions: string[];
};
type SearchResult = {
  id: string;
  page_link: string;
  title: string;
  snippet: string;
};


export default function InputWithButton() {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const [error, setError] = useState<string | null>(null);
  const [errorSecondAPI, setErrorSecondAPI] = useState<string | null>(null);

  const [query, setQuery] = useState<string>("");
  const [loadingFirstAPI, setLoadingFirstAPI] = useState<boolean>(false);
  const [loadingSecondAPI, setLoadingSecondAPI] = useState<boolean>(false);




  const handleFirstAPI = async (searchQuery: string) => {
    setLoadingFirstAPI(true);
    try {
      const response = await axios.post<ApiResponse>(
        "http://127.0.0.1:80/search/",
        { query: searchQuery }
      );
      console.log(response.data);
      console.log(response.data.similar_questions);
      console.log(response.data.answer);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data from first API:", error);
      setError(
        "Something went wrong with the first API. Please try again later."
      );
    }
    setLoadingFirstAPI(false);
  };

  const handleSecondAPI = async (searchQuery: string) => {
    setLoadingSecondAPI(true);
    try {
      const response = await axios.post<SearchResult[]>(
        "http://127.0.0.1:80/find/",
        { query: searchQuery }
      );
      console.log("Response from second API:", response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching data from second API:", error);
      setErrorSecondAPI(
        "Something went wrong with the second API. Please try again later."
      );
    }
    setLoadingSecondAPI(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    setError(null); // Reset the error state before making a new request
    setData(null); // Reset the data state to clear previous results

    handleFirstAPI(query);
    handleSecondAPI(query);

  };

  const handleRelatedSearchClick = async (relatedQuery: string) => {
    setData(null); // Reset the data state to clear previous results
    setQuery(relatedQuery); // Update the query state with the clicked related search
    handleFirstAPI(relatedQuery); // Fetch results for the clicked query
    handleSecondAPI(relatedQuery);
  };
  return (
    <>
      {isSubmitted ? (
        <form onSubmit={handleSearch}>
          <TextInput
            radius="md"
            size="md"
            placeholder="Ask a question or search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
                color={theme.primaryColor}
                variant="filled"
              >
                <IconArrowRight
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              </ActionIcon>
            }
            classNames={{
              root: classes.searchwidth,
            }}
          />
        </form>

      ) : (
        <Center maw={1000} h={600} >
          <form onSubmit={handleSearch}>
            <Center maw={1000} h={100} >
              <Title
                styles={{
                  root:
                  {
                    "fontSize": 80
                  }
                }}
              >Infrarail</Title>

            </Center>

            <TextInput
              radius="md"
              size={"lg"}
              placeholder="Ask a question or search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
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
                  color={theme.primaryColor}
                  variant="filled"
                >
                  <IconArrowRight
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              }
              classNames={{
                root: classes.searchwidth,
              }}
            />
            <Group justify="center"
              styles={{
                root:
                {
                  "paddingTop": 20
                },


              }}
            >
              <Button
                classNames={{ root: classes.button }}
                radius={"md"}
                leftSection={<IconFile size={14} />}
                variant="default">
                  Documents
                </Button>
                <Modal opened={opened} onClose={close} title="Import your Website" centered>
                We’ll crawl your site and pull in as much of your content as possible.
                <TextInput></TextInput>
      </Modal>
              <Button
              onClick={open}
                radius={"md"}
                classNames={{ root: classes.button }}
                leftSection={<IconWorldWww size={14} />}
                rightSection={<svg width="10" height="10" className="mt-[2px]" viewBox="0 0 7 7" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.52526 0L2.52292 0.999997L4.80175 1.00533L0 5.79743L0.706395 6.50525L5.5213 1.70002L5.5159 4.007L6.5159 4.00934L6.52526 0.00935186L2.52526 0Z" fill="currentColor"></path></svg>}
                variant="default">Webpages</Button>
              <Button
                radius={"md"}
                classNames={{ root: classes.button }}
                variant="default">Text</Button>
            </Group>
          </form>
        </Center>
      )}

      {loadingFirstAPI ? (
        <Paper
          shadow="sm"
          radius="md"
          withBorder
          p="lg"
          classNames={{ root: classes.cardanswer }}
        >
          <Group>
            Railsearch is Generating an answer{" "}
            <Loader color="rgba(33, 138, 98, 1)" type="dots" />
          </Group>{" "}
        </Paper>
      ) : error ? (
        <Text color="red">{error}</Text>
      ) : (
        data && (
          <>
            <Paper
              shadow="sm"
              radius="md"
              withBorder
              p="lg"
              classNames={{ root: classes.cardanswer }}
            >
              <Text fw={700}>Your Question: {query}</Text>
              <Text>{data.answer}</Text>
              <Space h="md" />
              <Text c="dimmed">Sources</Text>
              <Group>
                {data &&
                  data.references &&
                  data.references.map((ref, index) => {
                    // Check if the reference is an image by its extension
                    const isImage = /\.(jpg|jpeg|png|gif|bmp)$/i.test(ref);

                    return (
                      <div key={index}>
                        {isImage ? (
                          // Display the image using Next.js's Image component wrapped in Mantine's Image
                          <Image
                            component={NextImage}
                            src={`/api/image-proxy?url=${encodeURIComponent(
                              ref
                            )}`}
                            alt="Reference Image"
                            width={500}
                            height={300}
                            loader={({ src }) => src} // Use the default loader
                          />
                        ) : (
                          // Display the link
                          <Anchor
                            component={Link}
                            href={ref}
                            c="cyan.9"
                            size="md"
                            fw={500}
                          >
                            {ref}
                          </Anchor>
                        )}
                      </div>
                    );
                  })}
              </Group>
            </Paper>
          </>
        )
      )}
      <div className={classes.searchResultsSection}>
        <Grid>
          <Grid.Col span={{ base: 12, xs: 8 }}>
            {loadingSecondAPI ? (
              <>
                {" "}
                <Space h="lg" />
                <Skeleton height={50} circle mb="xl" />
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} width="70%" radius="xl" />
              </>
            ) : errorSecondAPI ? (
              <Text color="red">{errorSecondAPI}</Text>
            ) : (
              searchResults &&
              searchResults.map((result) => (
                <Paper
                  key={result.id}
                  radius="xs"
                  p="lg"
                  classNames={{ root: classes.card }}
                >
                  <Group>
                    <Avatar color="cyan" radius="xl">
                      WH
                    </Avatar>
                    <Anchor
                      component={Link}
                      href={result.page_link}
                      c="cyan.9"
                      size="lg"
                      fw={500}
                    >
                      {result.title}
                    </Anchor>
                  </Group>
                  <Text dangerouslySetInnerHTML={{ __html: result.snippet }} />
                </Paper>
              ))
            )}
          </Grid.Col>
          {/* Second Column: Display list of sources ONLY if there are search results */}
          {searchResults && searchResults.length > 0 && (
            <Grid.Col span={{ base: 12, xs: 4 }}>
              <Space h="lg" />
              <Text size="md">Found 10 results</Text>
              <Space h="lg" />
              <List spacing="xs" size="sm" center>
                <List.Item
                  icon={
                    <ThemeIcon color="gray" size={30}>
                      <IconFolderSearch size="1rem" />
                    </ThemeIcon>
                  }
                >
                  Website{" "}
                  <Badge variant="default" color="blue" radius="sm" size="sm">
                    50
                  </Badge>
                </List.Item>
                <List.Item
                  icon={
                    <ThemeIcon color="red" size={30} radius="md">
                      <IconMail size="1rem" />
                    </ThemeIcon>
                  }
                >
                  Gmail{" "}
                  <Badge variant="default" color="blue" radius="sm" size="sm">
                    0
                  </Badge>
                </List.Item>
                <List.Item
                  icon={
                    <ThemeIcon color="black" size={30} radius="sm">
                      <IconBrandNotion size="1rem" />
                    </ThemeIcon>
                  }
                >
                  Notion{" "}
                  <Badge variant="default" color="blue" radius="sm" size="sm">
                    0
                  </Badge>
                </List.Item>

                <List.Item
                  icon={
                    <ThemeIcon color="pink" size={30} radius="xs">
                      <IconBrandAirtable size="1rem" />
                    </ThemeIcon>
                  }
                >
                  Airtable{" "}
                  <Badge variant="default" color="blue" radius="sm" size="sm">
                    0
                  </Badge>
                </List.Item>
              </List>
            </Grid.Col>
          )}
        </Grid>

        {data && data.similar_questions && (
          <div className={classes.relatedSearchesSection}>
            <Text size="lg" fw={700} mb="md">
              Related Searches
            </Text>
            <ul>
              {data.similar_questions.slice(0, 3).map((question, index) => (
                <li key={index}>
                  <Anchor
                    size="md"
                    onClick={() => handleRelatedSearchClick(question)}
                  >
                    {question}
                  </Anchor>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
