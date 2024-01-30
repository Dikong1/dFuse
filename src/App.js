import './style.css';

function App() {
  return (
    <div className="App h-full">
      <NavBar />
      <AboutUsInfo />
    </div>
  );
}

function NavBar() {
  return (
    <nav className='inline-block w-full'>
      <div className='flex justify-between items-center mt-3'>
        <div>
          <a href='/' className='text-3xl font-extrabold align-middle ms-8'>dFUSE</a>
          <a href='/' className='text-xl font-extrabold align-middle ms-14'>About Us</a>
          <a href='/project' className='text-xl font-extrabold align-middle ms-14'>Projects</a>
        </div>
        <a href='/profile' className='align-middle me-4'>
          <img className='' width={35} src='https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png' alt='' />
        </a>
      </div>
    </nav>
  )
}

function AboutUsInfo() {
  return (
    <div>
      <div className='text-4xl font-extrabold mt-20 ms-8'>
        Spark Startup Success with dFUSE <br />
        Launching Dreams, Igniting Growth!
      </div>
      <div>
        <img src='../public/img/rocket.svg' alt='' />
      </div>
    </div>
  )
}

export default App;
