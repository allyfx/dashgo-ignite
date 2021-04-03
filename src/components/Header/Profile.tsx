import { Flex, Box, Text, Avatar } from "@chakra-ui/react";

interface IProfileProps {
  showProfileData: boolean;
}

export function Profile({ showProfileData = true }: IProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Alícia Foureaux</Text>
          <Text color="gray.300" fontSize="small">alicia@email.com</Text>
        </Box>
      )}
      <Avatar size="md" name="Alícia Foureaux" src="" />
    </Flex>
  );
}