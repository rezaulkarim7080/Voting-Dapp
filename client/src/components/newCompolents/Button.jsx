const Button = ({ btnName, handleClick, icon, classStyle }) => {
  return (
    <div className="inline-block">
      <button className={`btn btn-primary ${classStyle}`} onClick={handleClick}>
        {icon} {btnName}
      </button>
    </div>
  );
};

export default Button;
