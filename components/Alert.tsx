interface AlertProps {
    message: string | undefined;
}

export default function Alert(props: AlertProps) {
    if (props.message === undefined) {
        return null;
    }

    return (
        <article>{props.message}</article>
    );
}
