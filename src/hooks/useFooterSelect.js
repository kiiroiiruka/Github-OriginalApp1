import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useFooterSelect(options) {
    const [selected, setSelected] = useState(options[0]);
    const navigate = useNavigate();

    const handleSelect = (key) => {
        if (key === selected) return; // すでに選択されていれば何もしない

        setSelected(key);

        if (key === 'memoHome') {
            navigate('/');
        } else if (key === 'deadlineHome') {
            navigate('/deadline');
        }
    };

    return {
        options,
        selected,
        handleSelect,
    };
}

export default useFooterSelect;
