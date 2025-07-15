import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				'input-border': 'hsl(var(--input-border))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					light: 'hsl(var(--secondary-light))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-animated': 'var(--gradient-animated)',
				'gradient-hover': 'var(--gradient-hover)',
				'gradient-sidebar': 'var(--gradient-sidebar)',
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'glow': 'var(--shadow-glow)',
				'hover': 'var(--shadow-hover)',
				'active': 'var(--shadow-active)',
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)',
				'fast': 'var(--transition-fast)',
				'slow': 'var(--transition-slow)',
				'bounce': 'var(--transition-bounce)',
				'elastic': 'var(--transition-elastic)',
				'spring': 'var(--transition-spring)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px hsl(var(--primary) / 0.3), 0 0 10px hsl(var(--primary) / 0.2)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.5), 0 0 35px hsl(var(--primary) / 0.3)',
						transform: 'scale(1.02)'
					}
				},
				'slide-in-left': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(-30px)'
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)'
					}
				},
				'slide-in-right': {
					'0%': { 
						opacity: '0', 
						transform: 'translateX(30px)'
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateX(0)'
					}
				},
				'bounce-in': {
					'0%': { 
						opacity: '0', 
						transform: 'scale(0.3)'
					},
					'50%': { 
						opacity: '1', 
						transform: 'scale(1.05)'
					},
					'70%': { 
						transform: 'scale(0.9)'
					},
					'100%': { 
						opacity: '1', 
						transform: 'scale(1)'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'gradientShift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				// Animaciones mejoradas para móvil
				slideInLeft: {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				slideOutLeft: {
					'0%': { transform: 'translateX(0)', opacity: '1' },
					'100%': { transform: 'translateX(-100%)', opacity: '0' }
				},
				hamburgerPress: {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				staggerFadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				softBounce: {
					'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
					'40%': { transform: 'translateY(-2px)' },
					'60%': { transform: 'translateY(-1px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
				'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'slide-out-left': 'slideOutLeft 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
				'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'float': 'float 3s ease-in-out infinite',
				'gradient-shift': 'gradientShift 4s ease infinite',
				'hamburger-press': 'hamburgerPress 0.2s ease-out',
				'stagger-fade-in': 'staggerFadeIn 0.4s ease-out forwards',
				'soft-bounce': 'softBounce 0.6s ease-out'
			},
			spacing: {
				'sidebar': '240px',
				'sidebar-collapsed': '64px'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			const newUtilities = {
				'.scrollbar-thin': {
					'scrollbar-width': 'thin',
					'scrollbar-color': 'hsl(var(--sidebar-border) / 0.5) transparent',
				},
				'.scrollbar-thin::-webkit-scrollbar': {
					width: '6px',
				},
				'.scrollbar-thin::-webkit-scrollbar-track': {
					background: 'transparent',
				},
				'.scrollbar-thin::-webkit-scrollbar-thumb': {
					'background-color': 'hsl(var(--sidebar-border) / 0.5)',
					'border-radius': '3px',
					transition: 'background-color 0.2s ease',
				},
				'.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
					'background-color': 'hsl(var(--sidebar-border) / 0.8)',
				},
				'.scrollbar-track-transparent': {
					'scrollbar-color': 'transparent transparent',
				},
				'.scrollbar-thumb-sidebar-border': {
					'scrollbar-color': 'hsl(var(--sidebar-border) / 0.5) transparent',
				}
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
