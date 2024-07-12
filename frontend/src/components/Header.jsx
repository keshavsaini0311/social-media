import {Box, Button, Flex, Image, Input, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import useShowToast from "../hooks/useShowToast";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const showToast = useShowToast();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const[search , setSearch] = useState('')
	const[profiles, setProfiles] = useState([])

	const handlechange = async(e) => {
		setSearch(e.target.value)
		if(search.length <= 2){
			setProfiles([])
			return;
		}
			try{
				const res=await fetch(`/api/users/search/${search}`);
				const data =await res.json()
				if(data.error){
					setProfiles([])
					showToast("Error", data.error, "error");
					return;
				}
				setProfiles(data)
			}
			catch(error){
				console.log(error);
			}
		}
	

	
	
	return (
		<Flex justifyContent={"space-between"} mt={6} mb='12' >
			{user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}
			<Image
				cursor={"pointer"}
				alt='logo'
				w={6}
				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/>
			<Flex flexDirection={"row"} alignItems={"center"} gap={2}>
			
			<Flex flexDirection={"column"} alignItems={"center"} gap={2}>
			<Input
				placeholder='Search'
				variant='unstyled'
				border={"none"}
				outline={"none"}
				_focusVisible={{ outline: "none" }}
				onChange={handlechange}
			/>

			{profiles.length > 0 && (
				<Flex flexDirection={"column"} overflowY={"2px"} gap={1}>
					{profiles.map(profile => (
						<Link
							as={RouterLink}
							to={`/${profile.username}`}
							key={profile._id}
						>
							{profile.username}
						</Link>
					))}
				</Flex>
			)}

			</Flex>
			</Flex>
			{user && (
				<Flex alignItems={"right"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;
