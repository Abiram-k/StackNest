import { NavLink, NavLinkProps } from "react-router-dom";
interface CustomNavLinkProps extends NavLinkProps {
    children: React.ReactNode; 
    end?: boolean;
  }

export const CustomNavLink = ({ to, children, end = false }:CustomNavLinkProps) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => 
        `text-md font-medium transition-colors duration-300 ${
          isActive 
            ? 'text-primary font-bold border-b-2 border-primary' 
            : 'text-foreground hover:text-primary'
        }`
      }
    >
      {children}
    </NavLink>
  );