import {
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Button,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "next/link";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";

interface ICreateUserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória").min(6, "Mínimo de 6 caracteres"),
  password_confirmation: yup.string().oneOf([
    null, yup.ref("password"),
  ], "As senhas precisam ser iguais"),
});

export default function CreateUser() {
  const router = useRouter()

  const createUser = useMutation(async (user: ICreateUserFormData) => {
    const response = await api.post('/users', {
      user: {
        ...user,
        created_at: new Date(),
      }
    });

    return response.data.user;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const handleSubmitForm: SubmitHandler<ICreateUserFormData>
    = async (data) => {
      await createUser.mutateAsync(data);
      router.push('/users');
    };
  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        <Sidebar />
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>
          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                error={errors.name}
                name="name"
                label="Nome completo"
                {...register("name")}
              />
              <Input
                error={errors.email}
                name="email"
                type="email"
                label="E-mail"
                {...register("email")}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                error={errors.password}
                name="password"
                type="password"
                label="Senha"
                {...register("password")}
              />
              <Input
                error={errors.password_confirmation}
                name="password_confirmation"
                type="password"
                label="Confirmação da senha"
                {...register("password_confirmation")}
              />
            </SimpleGrid>
          </VStack>
          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button
                colorScheme="pink"
                isLoading={isSubmitting}
                type="submit"
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}