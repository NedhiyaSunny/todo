import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://localhost:8081/login", { email: email, password: password })
      .then((response) => {
        if (response.data) {
          localStorage.setItem("user_id", response.data[0].id);
          setError("");
          navigate("/home");
        } else {
          setError("Invalid Email or Password");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Body>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Heading>Login</Heading>
          <InputGroup>
            <Label htmlFor="email">Email:</Label>
            <Input
              required
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Label htmlFor="password">Password:</Label>
            <Input
              required
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit">Login</Button>
            <P>{error}</P>
          </InputGroup>
          <NewMember>
            New here? <StyledLink to="/signup">Sign up</StyledLink>
          </NewMember>
        </Form>
      </Container>
    </Body>
  );
};

export default LoginPage;

const Body = styled.body`
  background-color: #f0f0f0;
`;
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  background-color: #fff;
  max-width: 400px;
  width: 100%;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Heading = styled.h2`
  text-align: center;
  margin: 19px 0 30px;
  color: #333;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 16px;
  color: #666;
`;
const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 30px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;
const P = styled.p`
  color: red;
  text-align: center;
`;
const NewMember = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
