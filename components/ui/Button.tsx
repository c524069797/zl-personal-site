import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd'

interface ButtonProps extends Omit<AntButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link'
}

const variantStyles: Record<string, Partial<AntButtonProps>> = {
  primary: { type: 'primary' },
  secondary: { type: 'default' },
  ghost: { type: 'text' },
  link: { type: 'link' },
}

const Button = ({ variant = 'primary', ...props }: ButtonProps) => {
  return <AntButton {...variantStyles[variant]} {...props} />
}

export { Button }
export type { ButtonProps }
