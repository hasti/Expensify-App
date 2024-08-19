import React, {useCallback, useMemo} from 'react';
import useLocalize from '@hooks/useLocalize';
import {replaceAllDigits, replaceCommasWithPeriod, stripSpacesFromAmount, validateAmount} from '@libs/MoneyRequestUtils';
import CONST from '@src/CONST';
import TextInput from './TextInput';
import type {BaseTextInputProps} from './TextInput/BaseTextInput/types';

type AmountFormProps = {
    /** Amount supplied by the FormProvider */
    value?: string;

    /** Callback to update the amount in the FormProvider */
    onInputChange?: (value: string) => void;
} & Partial<BaseTextInputProps>;

function AmountWithoutCurrencyForm({value: amount, onInputChange, inputID, name, defaultValue, accessibilityLabel, role, label, ...rest}: AmountFormProps) {
    const {toLocaleDigit} = useLocalize();

    const currentAmount = useMemo(() => (typeof amount === 'string' ? amount : ''), [amount]);

    /**
     * Sets the selection and the amount accordingly to the value passed to the input
     * @param newAmount - Changed amount from user input
     */
    const setNewAmount = useCallback(
        (newAmount: string) => {
            // Remove spaces from the newAmount value because Safari on iOS adds spaces when pasting a copied value
            // More info: https://github.com/Expensify/App/issues/16974
            const newAmountWithoutSpaces = stripSpacesFromAmount(newAmount);
            const replacedCommasAmount = replaceCommasWithPeriod(newAmountWithoutSpaces);
            if (!validateAmount(replacedCommasAmount, 2)) {
                return;
            }
            onInputChange?.(replacedCommasAmount);
        },
        [onInputChange],
    );

    const formattedAmount = replaceAllDigits(currentAmount, toLocaleDigit);

    return (
        <TextInput
            value={formattedAmount}
            onChangeText={setNewAmount}
            inputID={inputID}
            name={name}
            label={label}
            defaultValue={defaultValue}
            accessibilityLabel={accessibilityLabel}
            role={role}
            keyboardType={CONST.KEYBOARD_TYPE.DECIMAL_PAD}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rest}
        />
    );
}

AmountWithoutCurrencyForm.displayName = 'AmountWithoutCurrencyForm';

export default AmountWithoutCurrencyForm;
