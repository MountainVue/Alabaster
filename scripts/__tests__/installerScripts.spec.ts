import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

/*
 * The uninstall lives in install.sh, so it can be a plan screen inside the
 * installer, and uninstall.sh only hands over to it. Both scripts ship in every
 * release and are documented as separate entry points, so the hand-over is the
 * contract: if install.sh stops accepting --uninstall, or uninstall.sh stops
 * passing it, `bash ~/alabaster/scripts/uninstall.sh` breaks on printers
 * nobody can run a test on.
 */

const read = (script: string) => readFileSync(join(process.cwd(), 'scripts', script), 'utf8')

describe('installer scripts', () => {
  it('uninstall.sh hands over to install.sh --uninstall, locally and when fetched alone', () => {
    const uninstall = read('uninstall.sh')
    expect(uninstall).toMatch(/exec bash "\$\{here\}\/install\.sh" --uninstall "\$@"/)
    expect(uninstall).toMatch(
      /raw\.githubusercontent\.com\/MountainVue\/Alabaster\/main\/scripts\/install\.sh.*--uninstall "\$@"/,
    )
  })

  /*
   * The repository is named in four places that a printer acts on, and nothing
   * but these assertions makes them agree: the installer downloads from REPO,
   * the template tells Moonraker which releases and which remote to follow,
   * and release_info.json's owner is what Moonraker compares its entry against.
   */
  const repository = /^REPO='([^']+)'$/m.exec(read('install.sh'))?.[1] ?? ''

  it('names one repository in the installer, the Moonraker template and the release', () => {
    const root = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')
    const template = root('deploy/moonraker/update_manager.conf')
    const [owner] = repository.split('/')

    expect(repository).toMatch(/^[^/\s]+\/[^/\s]+$/)
    expect(template).toMatch(new RegExp(`^repo: ${repository}$`, 'm'))
    expect(template).toMatch(new RegExp(`^origin: https://github\\.com/${repository}\\.git$`, 'm'))
    expect(root('.github/workflows/release.yml')).toContain(`"project_owner": "${owner}"`)
  })

  it('never lists its own repository among the ones it has left', () => {
    // An install following a former repository is moved to REPO. With REPO in
    // that list, every run would find the install it just moved and move it again.
    const former = /^FORMER_REPOS='([^']*)'$/m.exec(read('install.sh'))?.[1]
    expect(former, 'FORMER_REPOS is declared').toBeDefined()
    const left = former!.split(/\s+/).filter(Boolean)
    expect(left.map((name) => name.toLowerCase())).not.toContain(repository.toLowerCase())
    for (const name of left) expect(name).toMatch(/^[^/\s]+\/[^/\s]+$/)
  })

  it('install.sh accepts --uninstall and offers it in its help', () => {
    const install = read('install.sh')
    expect(install).toMatch(/--uninstall\) mode=uninstall; shift ;;/)
    expect(install).toMatch(/^ {2}--uninstall {13}\S/m)
  })
})
