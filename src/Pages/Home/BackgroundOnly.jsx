const BackgroundOnly = () => {
  return (
    <div className="absolute inset-0 -z-10 h-screen w-full overflow-hidden bg-[#020307]">
      <div className="aurora-field" aria-hidden="true">
        <div className="aurora-ribbon aurora-ribbon-one" />
        <div className="aurora-ribbon aurora-ribbon-two" />
        <div className="aurora-ribbon aurora-ribbon-three" />
      </div>

      <div className="aurora-glow" aria-hidden="true" />
      <div className="aurora-vignette" aria-hidden="true" />
      <div className="aurora-noise" aria-hidden="true" />
    </div>
  );
};

export default BackgroundOnly;
