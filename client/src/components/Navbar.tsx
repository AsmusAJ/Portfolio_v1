import { NavLink } from "react-router-dom";
import "./Navbar.css";

type NavItem = {
    label: string;
    to: string;
};

const navLinks: NavItem[] = [
    { label: "Home", to: "/" },
    { label: "Work", to: "/work" },
    { label: "Projects", to: "/projects" },
    { label: "About", to: "/about" },
];

export default function Navbar() {
    return (
        <nav aria-label="Main Navigation" className="navbar">
            <ul className="nav-links">
                {navLinks.map((link) => (
                    <li key={link.to}>
                        <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-link nav-link-active"
                                    : "nav-link"
                            }
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
