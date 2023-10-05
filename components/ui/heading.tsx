interface HeadingProps {
  title: string;
  description: string;
};

const Heading: React.FC<HeadingProps> = ({ title, description }) => { 
  return (
    <div>
      <div className="text-3xl font-bold tracking-tight">
        {title} 
      </div>
      <div className="font-medium text-muted-foreground">
        {description}
      </div>
    </div>
  )
}

export default Heading;