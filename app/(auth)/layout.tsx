export default function AuthLayout({
    children
}: {
    // The React.ReactNode is a type that represents a React element, an array of React elements,
    // or a string, number, or boolean.
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    )
}