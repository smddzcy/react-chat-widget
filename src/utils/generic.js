export const parseWidgetProps = str => {
  let props = {};
  try { props = JSON.parse(decodeURIComponent(str) || '{}'); } catch (_) {}
  return props;
};
