import { projects } from "./content/projects";

function App() {
  return (
    <>
      <div className="min-h-dvh bg-page w-full">
        <header>
          <h1 className="font-bold">Hassan's Digital Space</h1>
          <p>Welcome to my cozy home 🏡</p>
        </header>
        <main>
          <h2>Projects</h2>
          <ul>
            {projects.map((project) => {
              return (
                <li key={project.slug}>
                  <a target="_blank" href={project.href}>
                    {project.title}
                  </a>
                  <p>{project.tagline}</p>
                </li>
              );
            })}
          </ul>
        </main>
        <footer>
          <h2>Contact Links:</h2>
          <ul>
            <li>
              <a target="_blank" href="https://linkedin.com/in/hshsdev/">
                LinkedIn
              </a>
            </li>
            <li>
              <a target="_blank" href="https://github.com/Hshs-dev">
                GitHub
              </a>
            </li>
            <li>
              <a target="_blank" href="https://x.com/Hshs_dev">
                X
              </a>{" "}
              - the blue bird previously
            </li>
            <li>
              <a target="_blank" href="https://www.instagram.com/hs.2k3/">
                Instagram
              </a>
            </li>
            <li>
              <a target="_blank" href="mailto:officialhassansmail@gmail.com">
                Email
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://drive.google.com/file/d/1QQOJm9m1mNcCCCr9Xm8IQejK1jASoPrP/view?usp=drive_link"
              >
                CV
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
}

export default App;
