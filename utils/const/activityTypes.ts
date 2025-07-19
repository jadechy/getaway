const ACTIVITY_TYPES_SELECT: Record<string, boolean> = {
  id: true,
  url: true,
  title: true,
  description: true,
  cover_url: true,
  cover_alt: true,
  qfap_tags: true,
  address_name: true,
  address_street: true,
  address_zipcode: true,
  address_city: true,
  lat_lon: true,
  pmr: true,
  transport: true,
  price_type: true,
  price_detail: true,
  access_link: true,
  title_event: true,
  audience: true,
  date_start: true,
  date_end: true,
};
export const ACTIVITY_TYPES_SELECT_STRING = Object.keys(ACTIVITY_TYPES_SELECT)
  .filter((key) => ACTIVITY_TYPES_SELECT[key]) // Filter keys with truthy values
  .join(",");
