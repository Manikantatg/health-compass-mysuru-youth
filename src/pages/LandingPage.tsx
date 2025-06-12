  <div className="container mx-auto px-4 py-16">
    <div className="flex flex-col items-center text-center space-y-8">
      <div className="flex items-center gap-4">
        <img 
          src="https://img.freepik.com/premium-vector/worried-man-with-obesity-clip-art-vector-illustration_136875-5657.jpg" 
          alt="PediaPredict Logo" 
          className="h-24 w-24 object-contain"
        />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PediaPredict
        </h1>
      </div>
      <p className="text-xl text-muted-foreground max-w-2xl">
        Empowering youth health through early obesity risk assessment and personalized recommendations
      </p>
      <p className="text-sm font-medium text-[#7C3AED]">Provided by Doutly</p>
      <div className="flex gap-4">
        <Link to="/register">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Get Started
          </Button>
        </Link>
        <Link to="/about">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  </div> 