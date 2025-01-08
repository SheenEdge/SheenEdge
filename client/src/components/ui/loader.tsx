const loader = () => {
  return (
    <section className="flex items-center justify-center h-full w-full">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`h-5 w-5 rounded-full bg-blue-300 animate-pulseCustom ${
            index < 4 ? 'mr-2.5' : ''
          }`}
          style={{
            animationDelay: `${-0.3 + index * 0.2}s`,
          }}
        ></div>
      ))}
    </section>
  );
};

export default loader;
