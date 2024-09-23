const KG_PER_POUND = 0.45359237;
const KG_PER_STONE = 6.35029318;
const CM_PER_INCH = 2.54;
const CM_PER_FOOT = 30.48;
const STONES_PER_KG = 0.157473044;
const POUNDS_PER_STONE = 14;
const FEET_PER_CM = 0.032808399;
const INCH_PER_FEET = 12;

const formElement = document.getElementById('bmi_form')!;
const radioUnitsMetric = document.getElementById('units_metric')!;
const radioUnitsImperial = document.getElementById('units_imperial')!;
const unitsContainerElement = document.getElementById('units_container')!;
const inputHeightPrimaryElement = document.getElementById('height_primary')! as HTMLInputElement;
const inputHeightSecondaryElement = document.getElementById('height_secondary')! as HTMLInputElement;
const inputWeightPrimaryElement = document.getElementById('weight_primary')! as HTMLInputElement;
const inputWeightSecondaryElement = document.getElementById('weight_secondary')! as HTMLInputElement;
const inputHeightSecondaryContainerElement = document.getElementById('height_secondary_container')!;
const inputWeightSecondaryContainerElement = document.getElementById('weight_secondary_container')!;
const bmiContainerElement = document.getElementById('bmi_container')!;

let selectedUnit = 'metric';

const calcBmi = (weight: number, height: number): number => Number((Math.round((weight / (height / 100) ** 2) * 10) / 10).toFixed(1));
const calcFeetToCm = (lengthInFeet: number): number => lengthInFeet * CM_PER_FOOT;
const calcInchToCm = (lengthInInch: number): number => lengthInInch * CM_PER_INCH;
const calcStonesToKg = (weightInStones: number): number => weightInStones * KG_PER_STONE;
const calcPoundsToKg = (weightInPounds: number): number => weightInPounds * KG_PER_POUND;
const calcCmToImperial = (lengthInCm: number): { feet: number; inches: number } => {
    const totalLengthFeet = lengthInCm * FEET_PER_CM;
    const lengthInFeet = Math.trunc(totalLengthFeet);
    const lengthInInches = Math.floor((totalLengthFeet - lengthInFeet) * INCH_PER_FEET);

    return {
        feet: lengthInFeet,
        inches: lengthInInches,
    };
};
const calcKgToImperial = (weightInKg: number): { stones: number; pounds: number } => {
    const totalWeightStones = weightInKg * STONES_PER_KG;
    const weightInStones = Math.trunc(totalWeightStones);
    const weightInPounds = Math.floor((totalWeightStones - weightInStones) * POUNDS_PER_STONE);

    return {
        stones: weightInStones,
        pounds: weightInPounds,
    };
};
const getImperialString = ({ stones, pounds }: { stones: number; pounds: number }): string => `${stones}st ${pounds}lbs`;

const useMetric = function (): void {
    inputHeightSecondaryContainerElement.classList.add('hidden');
    inputWeightSecondaryContainerElement.classList.add('hidden');

    if (inputWeightPrimaryElement.value) {
        inputWeightPrimaryElement.value = Math.round(calcStonesToKg(+inputWeightPrimaryElement.value) + calcPoundsToKg(+inputWeightSecondaryElement.value)).toString();
    }

    if (inputHeightPrimaryElement.value) {
        inputHeightPrimaryElement.value = Math.ceil(calcFeetToCm(+inputHeightPrimaryElement.value) + calcInchToCm(+inputHeightSecondaryElement.value)).toString();
    }

    handleInputChanged();

    inputHeightPrimaryElement.nextElementSibling!.textContent = 'cm';
    inputWeightPrimaryElement.nextElementSibling!.textContent = 'kg';

    unitsContainerElement.classList.add('md:flex-row');
};

const useImperial = function (): void {
    inputHeightSecondaryContainerElement.classList.remove('hidden');
    inputWeightSecondaryContainerElement.classList.remove('hidden');

    if (inputWeightPrimaryElement.value) {
        const { stones, pounds } = calcKgToImperial(+inputWeightPrimaryElement.value);
        inputWeightPrimaryElement.value = stones.toString();
        inputWeightSecondaryElement.value = pounds.toString();
    }

    if (inputHeightPrimaryElement.value) {
        const { feet, inches } = calcCmToImperial(+inputHeightPrimaryElement.value);
        inputHeightPrimaryElement.value = feet.toString();
        inputHeightSecondaryElement.value = inches.toString();
    }

    handleInputChanged();

    inputHeightPrimaryElement.nextElementSibling!.textContent = 'ft';
    inputWeightPrimaryElement.nextElementSibling!.textContent = 'st';

    unitsContainerElement.classList.remove('md:flex-row');
};

const getClassification = function (bmi: number): string {
    if (bmi < 18.5) {
        return `Your BMI suggests you're underweight.`;
    }
    if (bmi >= 18.5 && bmi <= 24.9) {
        return `Your BMI suggests you’re a healthy weight.`;
    }
    if (bmi >= 25 && bmi <= 29.9) {
        return `Your BMI suggests you're overweight.`;
    }
    if (bmi >= 30) {
        return `Your BMI suggests you're obese.`;
    }

    return 'Invalid BMI';
};

const getHealthyRange = function (heightInCm: number): string {
    const heightMetersSq = (heightInCm / 100) ** 2;

    const idealLower = (Math.round(18.5 * heightMetersSq * 10) / 10).toFixed(1);
    const idealHigher = (Math.round(24.9 * heightMetersSq * 10) / 10).toFixed(1);

    if (selectedUnit === 'imperial') {
        return `${getImperialString(calcKgToImperial(+idealLower))} - ${getImperialString(calcKgToImperial(+idealHigher))}`;
    }

    return `${idealLower}kgs - ${idealHigher}kgs`;
};

const renderBmi = function (bmi: number, classification: string, healthyRange: string): void {
    bmiContainerElement.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 md:items-center">
            <div class="md:w-1/2">
                <p class="mb-2">Your BMI is...</p>
                <h2 class="text-5xl lg:text-6xl font-semibold">${bmi}</h2>
            </div>
            <p class="md:w-1/2">${classification} Your ideal weight is between <strong>${healthyRange}</strong>.</p>
        </div>
    `;
};

const handleInputChanged = function (): void {
    let totalHeight = +inputHeightPrimaryElement.value;
    let totalWeight = +inputWeightPrimaryElement.value;

    if (selectedUnit === 'imperial') {
        totalHeight = calcFeetToCm(+inputHeightPrimaryElement.value) + calcInchToCm(+inputHeightSecondaryElement.value);
        totalWeight = calcStonesToKg(+inputWeightPrimaryElement.value) + calcPoundsToKg(+inputWeightSecondaryElement.value);
    }

    if (totalHeight <= 0 || totalWeight <= 0) return;

    const bmi = calcBmi(totalWeight, totalHeight);

    if (bmi <= 0 || bmi >= 100) return;

    const classification = getClassification(bmi);
    const healthyRange = getHealthyRange(totalHeight);

    renderBmi(bmi, classification, healthyRange);
};

const onUnitsChanged = function (e: Event): void {
    const targetElement = e.target as HTMLInputElement;
    if (!targetElement) return;

    selectedUnit = targetElement.value;

    if (selectedUnit === 'metric') {
        useMetric();
    }

    if (selectedUnit === 'imperial') {
        useImperial();
    }
};

const onInputChanged = function (e: Event): void {
    handleInputChanged();
};

radioUnitsMetric?.addEventListener('change', onUnitsChanged);
radioUnitsImperial?.addEventListener('change', onUnitsChanged);
inputHeightPrimaryElement.addEventListener('input', onInputChanged);
inputHeightSecondaryElement.addEventListener('input', onInputChanged);
inputWeightPrimaryElement.addEventListener('input', onInputChanged);
inputWeightSecondaryElement.addEventListener('input', onInputChanged);
