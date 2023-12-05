import { ButtonIcon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode, useCallback, useEffect, useRef } from 'react'

import { Demo } from 'app/components/Demo'
import { Drawer } from 'app/components/Drawer'
import { TabData, Tabs } from 'app/components/Tabs'
import { i18n } from 'app/i18n'
import { DrawerId, useDrawer } from 'app/state/drawer'
import { cns } from 'app/utils/cns'

enum MetadataTab {
  Metadata = 'metadata',
  HowToCite = 'howToCite',
}

const TAB_OPTIONS: TabData<MetadataTab>[] = [
  {
    label: i18n.metadata,
    value: MetadataTab.Metadata,
  },
  // {
  //   label: i18n.howToCite,
  //   value: MetadataTab.HowToCite,
  // },
]

const ACTIVE_TAB_PARAM = 'tab'

interface MetaDataDrawerProps {
  children: ReactNode
  disabled?: boolean
  drawerId: DrawerId
  label: string
  onClose?(): void
  title: string
}

export function MetadataDrawer({
  children,
  disabled,
  drawerId,
  label,
  onClose,
  title,
}: MetaDataDrawerProps) {
  const drawer = useDrawer()

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get(ACTIVE_TAB_PARAM) ??
    MetadataTab.Metadata) as MetadataTab

  const initialLoadRef = useRef(true)
  if (initialLoadRef.current && searchParams.has(ACTIVE_TAB_PARAM)) {
    initialLoadRef.current = false
    drawer.setActiveDrawerId(drawerId)
  }

  useEffect(() => {
    if (
      drawer.activeDrawerId &&
      searchParams.get(ACTIVE_TAB_PARAM) !== activeTab
    ) {
      setSearchParams((params) => {
        params.set(ACTIVE_TAB_PARAM, activeTab)
        return params
      })
    } else if (!drawer.activeDrawerId) {
      setSearchParams((params) => {
        params.delete(ACTIVE_TAB_PARAM)
        return params
      })
    }
  }, [activeTab, drawer.activeDrawerId, searchParams, setSearchParams])

  const handleClose = useCallback(() => {
    drawer.setActiveDrawerId(null)
    onClose?.()
  }, [drawer, onClose])

  return (
    <Drawer
      open={drawer.activeDrawerId === drawerId && !disabled}
      onClose={handleClose}
    >
      <div className="flex flex-col flex-auto">
        <header className="flex items-start justify-between px-sds-xl pt-sds-xl pb-sds-xxl">
          <div className="flex flex-col gap-sds-s">
            <p className="text-xs text-sds-gray-600 font-semibold uppercase">
              {label}
            </p>

            <p className="text-sds-header-xl font-semibold text-black leading-sds-header-xl line-clamp-3">
              {title}
            </p>
          </div>

          <ButtonIcon
            onClick={handleClose}
            sdsIcon="xMark"
            sdsIconProps={{
              color: 'gray',
            }}
          />
        </header>

        <div className="px-sds-xl border-b-2 border-sds-gray-200">
          <Tabs
            className="!m-0"
            tabs={TAB_OPTIONS}
            value={activeTab}
            onChange={() => null}
            // onChange={(tab) =>
            //   setSearchParams((params) => {
            //     params.set(ACTIVE_TAB_PARAM, tab)
            //     return params
            //   })
            // }
          />
        </div>

        <div
          className={cns(
            'flex flex-col flex-auto',
            'px-sds-xl pt-sds-xl pb-sds-xxl',

            activeTab === MetadataTab.Metadata &&
              'divide-y divide-sds-gray-300',
          )}
        >
          {activeTab === MetadataTab.Metadata && children}

          {activeTab === MetadataTab.HowToCite && <Demo>How to cite</Demo>}
        </div>
      </div>
    </Drawer>
  )
}
