/** Hint to the user agent indicating what configuration of GPU is suitable for a WebGL context. */
const enum PowerPreference {
    /** Lets the user agent decide which GPU configuration is most suitable. */
    Default = "default",

    /** Prioritizes rendering performance over power consumption. */
    HighPerformance = "high-performance",

    /** Prioritizes power saving over rendering performance. */
    LowPower = "low-power"
}

export default PowerPreference;
