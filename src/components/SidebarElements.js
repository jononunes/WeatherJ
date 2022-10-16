import styled from "styled-components";

export const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  left: 0;
  background-color: ${({ modeChecked }) =>
    modeChecked ? "#262626" : "#ffffff"};
  height: 100vh;
  width: 85vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;
  box-shadow: outset -7px 0px 14px rgba(0, 0, 0, 0.15);
  transition: 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
`;
