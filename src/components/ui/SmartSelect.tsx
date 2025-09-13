"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";

/** ---- Types ---- */
export type OptionValue = string | number;

export type SmartOption<T extends OptionValue = OptionValue> = {
    label: React.ReactNode;
    value: T;
    disabled?: boolean;
    /** free field for callers to stash anything (id, code, etc.) */
    meta?: unknown;
};

type CommonProps<T extends OptionValue> = {
    /** All options for local (non-remote) mode */
    options?: SmartOption<T>[];
    /** Tailwind/extra classes on wrapper */
    className?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Disable whole control */
    disabled?: boolean;
    /** Compact density (smaller height) */
    dense?: boolean;
    /** Clear button */
    allowClear?: boolean;
    /** Show an asterisk / required style (visual only) */
    required?: boolean;
    /** antd dropdown z-index, container, etc. */
    dropdownMatchSelectWidth?: boolean;
    getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
    /** Pass-through loading (e.g. while options are being fetched outside) */
    loading?: boolean;

    /** Custom filtering when showSearch = true (local search) */
    filterOption?:
    | boolean
    | ((input: string, option?: SmartOption<T> & { label?: React.ReactNode; value?: T }) => boolean);

    /** Custom renderers */
    renderOptionLabel?: (opt: SmartOption<T>) => React.ReactNode;
    renderTag?: (value: T, option?: SmartOption<T>) => React.ReactNode;

    /** Accessibility */
    "aria-label"?: string;
    id?: string;
};

/** Remote search configuration (optional) */
export type RemoteSearchConfig<T extends OptionValue> = {
    /** enable remote search mode; if provided, component ignores local options while searching */
    remote?: boolean;
    /** your async loader; receives the debounced search term, must return options */
    searchFn?: (term: string) => Promise<SmartOption<T>[]>;
    /** debounce (ms) before calling searchFn; default 300 */
    debounceMs?: number;
    /** initial options to show before any search (e.g. popular) */
    initialRemoteOptions?: SmartOption<T>[];
};

/** Discriminated union for single vs multiple */
type SingleSelectProps<T extends OptionValue> = CommonProps<T> &
    RemoteSearchConfig<T> & {
        multiple?: false;
        /** controlled single value */
        value?: T | null;
        defaultValue?: T | null;
        onChange?: (value: T | null, option?: SmartOption<T>) => void;
    };

type MultipleSelectProps<T extends OptionValue> = CommonProps<T> &
    RemoteSearchConfig<T> & {
        multiple: true;
        /** controlled multiple values */
        value?: T[];
        defaultValue?: T[];
        onChange?: (value: T[], options?: SmartOption<T>[]) => void;
        /** max visible tags before +N counter */
        maxTagCount?: number | "responsive";
    };

export type SmartSelectProps<T extends OptionValue> =
    | SingleSelectProps<T>
    | MultipleSelectProps<T>;

/** ---- small util: debounce ---- */
function useDebouncedValue<T>(value: T, ms = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), ms);
        return () => clearTimeout(id);
    }, [value, ms]);
    return debounced;
}

/** ---- Component ---- */
export default function SmartSelect<T extends OptionValue>(props: SmartSelectProps<T>) {
    const {
        options = [],
        className,
        placeholder = "Select…",
        disabled,
        dense,
        allowClear = true,
        required,
        dropdownMatchSelectWidth,
        getPopupContainer,
        loading,
        filterOption,
        renderOptionLabel,
        renderTag,
        "aria-label": ariaLabel,
        id,
    } = props as CommonProps<T>;

    const isMultiple = !!(props as MultipleSelectProps<T>).multiple;
    const mode = isMultiple ? "multiple" : undefined;

    // --- search handling ---
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search, props.debounceMs ?? 300);

    const [remoteOpts, setRemoteOpts] = useState<SmartOption<T>[]>(props.initialRemoteOptions ?? []);
    const [remoteLoading, setRemoteLoading] = useState(false);
    const isRemote = !!props.remote && !!props.searchFn;

    // Fetch remote when open + search term changes
    useEffect(() => {
        let cancelled = false;
        const go = async () => {
            if (!isRemote) return;
            // Call only when dropdown is open (optional UX optimization)
            if (!open) return;
            setRemoteLoading(true);
            try {
                const data = await props.searchFn!(debounced);
                if (!cancelled) setRemoteOpts(data);
            } catch {
                if (!cancelled) setRemoteOpts([]);
            } finally {
                if (!cancelled) setRemoteLoading(false);
            }
        };
        go();
        return () => {
            cancelled = true;
        };
    }, [debounced, isRemote, open, props]);

    // final options to show:
    const finalOptions: SmartOption<T>[] = useMemo(() => {
        if (isRemote) return remoteOpts;
        return options;
    }, [isRemote, options, remoteOpts]);

    // map to AntD format
    const antdOptions = useMemo(
        () =>
            finalOptions.map((o) => ({
                label: renderOptionLabel ? renderOptionLabel(o) : o.label,
                value: o.value,
                disabled: o.disabled,
                // keep a reference to original:
                _orig: o,
            })),
        [finalOptions, renderOptionLabel]
    );

    // controlled values:
    const value = (props as SingleSelectProps<T>).value ?? (props as MultipleSelectProps<T>).value;
    const defaultValue =
        (props as SingleSelectProps<T>).defaultValue ?? (props as MultipleSelectProps<T>).defaultValue;

    // onChange proxy that returns SmartOption(s) to caller
    const handleChange = (val: any, opt: any) => {
        if (isMultiple) {
            const opts = Array.isArray(opt) ? opt : [];
            const mapped: SmartOption<T>[] = opts.map((o) => o?._orig ?? { label: o?.label, value: o?.value });
            (props as MultipleSelectProps<T>).onChange?.(val as T[], mapped);
        } else {
            const mapped: SmartOption<T> | undefined = opt?._orig ?? (opt ? { label: opt?.label, value: opt?.value } : undefined);
            (props as SingleSelectProps<T>).onChange?.((val ?? null) as T | null, mapped);
        }
    };

    // tag render (multiple)
    const tagRender = renderTag
        ? (tagProps: any) => {
            const opt = finalOptions.find((o) => o.value === tagProps.value);
            return <span {...tagProps.props}>{renderTag(tagProps.value, opt)}</span>;
        }
        : undefined;

    // css height
    const sizeClass = dense ? "h-9" : "h-10";

    return (
        <div className={["w-full", className].filter(Boolean).join(" ")}>
            <Select
                id={id}
                aria-label={ariaLabel}
                mode={mode as any}
                allowClear={allowClear}
                disabled={disabled}
                placeholder={
                    <span className="text-gray-500">
                        {placeholder}
                        {required ? <span className="text-red-500"> *</span> : null}
                    </span>
                }
                value={value as any}
                defaultValue={defaultValue as any}
                onChange={handleChange}
                options={antdOptions as any}
                className={["w-full", sizeClass].join(" ")}
                dropdownMatchSelectWidth={dropdownMatchSelectWidth}
                getPopupContainer={getPopupContainer}
                // search
                showSearch={!!filterOption || isRemote || false}
                filterOption={isRemote ? false : filterOption ?? true}
                onSearch={setSearch}
                onDropdownVisibleChange={setOpen}
                // loading
                notFoundContent={(loading || remoteLoading) ? <Spin size="small" /> : null}
                tagRender={tagRender as any}
                maxTagCount={(props as MultipleSelectProps<T>).maxTagCount}
                virtual
            />
        </div>
    );
}
