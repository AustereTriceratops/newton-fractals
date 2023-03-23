type controlsProps = {
    params: number[];
    controls_hidden: boolean;

    setParams: (value: number, index: number) => void;
    setColorScheme: (value: number) => void;
    toggleControls: () => void;
}

type mainProps = {
    params: number[];
    color_scheme: number;
    controls_hidden: boolean;
}

export { type controlsProps, type mainProps }