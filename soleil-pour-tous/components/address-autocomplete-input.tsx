"use client";

import { useEffect, useRef } from "react";
import { Input, type InputProps } from "@/components/ui/input";

export type AddressParts = {
  adresse: string;
  codePostal: string;
  ville: string;
};

type AddressAutocompleteInputProps = Omit<InputProps, "onChange" | "value"> & {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (parts: AddressParts) => void;
};

let placesLoader: Promise<void> | null = null;

function loadGooglePlaces(apiKey: string) {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();

  if (!placesLoader) {
    placesLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        apiKey
      )}&libraries=places&language=fr&region=FR`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Impossible de charger Google Maps"));
      document.head.appendChild(script);
    });
  }
  return placesLoader;
}

function getComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string
) {
  return components.find((c) => c.types.includes(type))?.long_name ?? "";
}

export function AddressAutocompleteInput({
  value,
  onChange,
  onAddressSelect,
  ...inputProps
}: AddressAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const onAddressSelectRef = useRef(onAddressSelect);
  onChangeRef.current = onChange;
  onAddressSelectRef.current = onAddressSelect;

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !inputRef.current) return;

    let cancelled = false;
    let autocomplete: google.maps.places.Autocomplete | null = null;

    loadGooglePlaces(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current) return;

        autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "fr" },
          fields: ["address_components", "formatted_address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete!.getPlace();
          const components = place.address_components ?? [];

          const streetNumber = getComponent(components, "street_number");
          const route = getComponent(components, "route");
          const codePostal = getComponent(components, "postal_code");
          const ville =
            getComponent(components, "locality") ||
            getComponent(components, "postal_town");

          const adresse =
            [streetNumber, route].filter(Boolean).join(" ") ||
            place.formatted_address ||
            "";

          onChangeRef.current(adresse);
          onAddressSelectRef.current({ adresse, codePostal, ville });
        });
      })
      .catch(() => {
        // Google Maps indisponible : l'utilisateur peut toujours saisir l'adresse à la main.
      });

    return () => {
      cancelled = true;
      if (autocomplete) {
        window.google?.maps?.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  return (
    <Input
      {...inputProps}
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
    />
  );
}
