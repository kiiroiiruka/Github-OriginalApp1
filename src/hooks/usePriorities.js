// hooks/usePriorities.js
import { useState } from "react";

const usePriorities = (initialPriorities = ["高"]) => {
    const [selectedPriorities, setSelectedPriorities] = useState(initialPriorities);

    const togglePriority = (level) => {
        setSelectedPriorities((prev) =>
            prev.includes(level)
                ? prev.filter((p) => p !== level)
                : [...prev, level]
        );
    };

    return [selectedPriorities, togglePriority];
};

export default usePriorities;
