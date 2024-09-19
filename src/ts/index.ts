import { log } from 'console';

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

const calcBmi = (weight: number, height: number): number => Number((Math.round((weight / (height / 100) ** 2) * 10) / 10).toFixed(1));

const calcFeetToCm = (lengthInFeet: number): number => lengthInFeet * 30.48;
const calcInchToCm = (lengthInInch: number): number => lengthInInch * 2.54;
const calcStonesToKg = (weightInStones: number): number => weightInStones * 6.35029318;
const calcPoundsToKg = (weightInPounds: number): number => weightInPounds * 0.45359237;
const calcKgToImperial = (weightInKg: number): string => {
    const totalWeight = weightInKg * 0.157473044;
    const weightInStones = Math.trunc(totalWeight);
    const weightInPounds = Math.floor((totalWeight - weightInStones) * 14);

    return `${weightInStones}st ${weightInPounds}lbs`;
};

let selectedUnit = 'metric';

const useMetric = function (): void {
    inputHeightSecondaryContainerElement.classList.add('hidden');
    inputWeightSecondaryContainerElement.classList.add('hidden');

    inputHeightPrimaryElement.nextElementSibling!.textContent = 'cm';
    inputWeightPrimaryElement.nextElementSibling!.textContent = 'kg';

    unitsContainerElement.classList.add('md:flex-row');
};

const useImperial = function (): void {
    inputHeightSecondaryContainerElement.classList.remove('hidden');
    inputWeightSecondaryContainerElement.classList.remove('hidden');

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
        return `${calcKgToImperial(+idealLower)} - ${calcKgToImperial(+idealHigher)}`;
    }

    return `${idealLower}kgs - ${idealHigher}kgs`;
};

const renderBmi = function (bmi: number, classification: string, healthyRange: string): void {
    bmiContainerElement.innerHTML = `
        <p class="mb-2">Your BMI is...</p>
        <h2 class="mb-6 text-4xl font-semibold">${bmi}</h2>
        <p>${classification} Your ideal weight is between <strong>${healthyRange}</strong>.</p>
    `;
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

radioUnitsMetric?.addEventListener('change', onUnitsChanged);
radioUnitsImperial?.addEventListener('change', onUnitsChanged);

inputHeightPrimaryElement.addEventListener('input', onInputChanged);
inputHeightSecondaryElement.addEventListener('input', onInputChanged);
inputWeightPrimaryElement.addEventListener('input', onInputChanged);
inputWeightSecondaryElement.addEventListener('input', onInputChanged);
