interface BienvenidoProps {
  name: string;
}

export const Welcome = (props: BienvenidoProps) => {
  if (props.name === "Camila") {
    return <div>Hello, {props.name}!</div>;
  } else {
    return <div> You are not Camila, who the f*ck are you?</div>;
  }
};